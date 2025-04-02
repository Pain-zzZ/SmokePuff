// controllers/mercadoPagoController.js
const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');
const Pago = require('../models/pagoModel');
const Pedido = require('../models/pedidoModel');
const Cliente = require('../models/clienteModel');
const DetallePedido = require('../models/detallePedidoModel');
const Producto = require('../models/productoModel');

// Configuración del cliente de Mercado Pago
const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || 'TEST-XXXX-XXXX-XXXX-XXXX' // Mejor en variables de entorno
});

// Instancias de los recursos
const preferenceClient = new Preference(client);
const paymentClient = new Payment(client);

// Controlador para Mercado Pago
const mercadoPagoController = {
    
    // Crear checkout de Mercado Pago
    async crearCheckoutPro(req, res) {
        try {
            const { pedido_id } = req.body;
            
            if (!pedido_id) {
                return res.status(400).json({
                    ok: false,
                    msg: 'El ID del pedido es requerido'
                });
            }
            
            // Obtener el pedido
            const pedido = await Pedido.findByPk(pedido_id);
            if (!pedido) {
                return res.status(404).json({
                    ok: false,
                    msg: 'Pedido no encontrado'
                });
            }
            
            // Obtener el cliente
            const cliente = await Cliente.findByPk(pedido.cliente_id);
            if (!cliente) {
                return res.status(404).json({
                    ok: false,
                    msg: 'Cliente no encontrado'
                });
            }
            
            // Obtener los detalles del pedido
            const detallesPedido = await DetallePedido.findAll({
                where: { pedido_id: pedido_id }
            });
            
            if (!detallesPedido || detallesPedido.length === 0) {
                return res.status(404).json({
                    ok: false,
                    msg: 'No hay productos en el pedido'
                });
            }
            
            // Obtener información completa de los productos
            const items = await Promise.all(detallesPedido.map(async (detalle) => {
                const producto = await Producto.findByPk(detalle.producto_id);
                return {
                    id: producto.id.toString(),
                    title: producto.nombre,
                    description: producto.descripcion || '',
                    quantity: parseInt(detalle.cantidad),
                    currency_id: 'MXN', // Ajusta según tu país
                    unit_price: parseFloat(detalle.precio)
                };
            }));
            
            // Crear preferencia de pago
            const preferenceData = {
                items: items,
                back_urls: {
                    success: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/pago/exito`,
                    failure: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/pago/error`,
                    pending: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/pago/pendiente`
                },
                auto_return: 'approved',
                external_reference: pedido.id.toString(),
                notification_url: `${process.env.BACKEND_URL || 'http://localhost:8080'}/api/pagos/webhook`,
                payer: {
                    name: cliente.nombre,
                    email: cliente.correo,
                    phone: {
                        number: cliente.telefono
                    }
                }
            };
            
            // Crear preferencia en Mercado Pago
            const preference = await preferenceClient.create({ body: preferenceData });
            
            // Guardar registro de pago en la base de datos
            const nuevoPago = await Pago.create({
                pedido_id: pedido_id,
                metodo_pago: 'mercadopago',
                estado_pago: 'pendiente',
                referencia_pago: preference.id,
                fecha_pago: new Date()
            });
            
            return res.status(201).json({
                ok: true,
                pago: nuevoPago,
                preferencia: {
                    id: preference.id,
                    init_point: preference.init_point, // URL para producción
                    sandbox_init_point: preference.sandbox_init_point // URL para pruebas
                }
            });
            
        } catch (error) {
            console.error('Error al crear checkout de Mercado Pago:', error);
            return res.status(500).json({
                ok: false,
                msg: 'Error al crear el checkout de pago',
                error: error.message
            });
        }
    },
    
    // Procesar webhook (notificaciones) de Mercado Pago
    async procesarWebhook(req, res) {
        try {
            let data = {};
            
            // Mercado Pago puede enviar notificaciones por query params o por body
            if (req.method === 'GET') {
                data = req.query;
            } else {
                data = req.body;
            }
            
            console.log('Webhook recibido:', data);
            
            // Verificar si es una notificación de pago
            if (data.type === 'payment' && data.data && data.data.id) {
                const paymentId = data.data.id;
                
                // Obtener detalles del pago desde Mercado Pago
                const paymentInfo = await paymentClient.get({ id: paymentId });
                
                if (paymentInfo && paymentInfo.external_reference) {
                    const pedidoId = paymentInfo.external_reference;
                    
                    // Buscar el pago en nuestra base de datos
                    const pago = await Pago.findOne({
                        where: { 
                            pedido_id: pedidoId,
                            metodo_pago: 'mercadopago'
                        }
                    });
                    
                    if (pago) {
                        // Actualizar el estado del pago según respuesta de Mercado Pago
                        let nuevoEstado;
                        
                        switch (paymentInfo.status) {
                            case 'approved':
                                nuevoEstado = 'completado';
                                break;
                            case 'in_process':
                            case 'pending':
                                nuevoEstado = 'procesando';
                                break;
                            case 'rejected':
                                nuevoEstado = 'fallido';
                                break;
                            case 'refunded':
                                nuevoEstado = 'reembolsado';
                                break;
                            default:
                                nuevoEstado = 'pendiente';
                        }
                        
                        // Actualizar el pago
                        await pago.update({
                            estado_pago: nuevoEstado,
                            referencia_pago: paymentId.toString()
                        });
                        
                        // Si el pago fue completado, actualizar también el pedido
                        if (nuevoEstado === 'completado') {
                            const pedido = await Pedido.findByPk(pedidoId);
                            if (pedido) {
                                await pedido.update({ estado: 'pagado' });
                            }
                        }
                        
                        console.log(`Pago actualizado: ID ${pago.id}, Estado: ${nuevoEstado}`);
                    } else {
                        console.log(`No se encontró el pago para el pedido ${pedidoId}`);
                    }
                }
            }
            
            // Siempre responder con 200 a Mercado Pago
            return res.status(200).send('OK');
            
        } catch (error) {
            console.error('Error al procesar webhook de Mercado Pago:', error);
            // Aun con error, retornamos 200 para que MP no reintente
            return res.status(200).send('OK');
        }
    },
    
    // Obtener estado de pago de un pedido
    async obtenerEstadoPago(req, res) {
        try {
            const { pedido_id } = req.params;
            
            // Buscar pagos del pedido
            const pagos = await Pago.findAll({
                where: { pedido_id },
                order: [['fecha_pago', 'DESC']]
            });
            
            if (!pagos || pagos.length === 0) {
                return res.status(404).json({
                    ok: false,
                    msg: 'No se encontraron pagos para este pedido'
                });
            }
            
            // Obtener el último pago
            const ultimoPago = pagos[0];
            
            // Si es de Mercado Pago y tiene referencia, buscar info actualizada
            let infoMercadoPago = null;
            
            if (ultimoPago.metodo_pago === 'mercadopago' && ultimoPago.referencia_pago) {
                try {
                    // Buscar por referencia externa (pedido_id)
                    const searchResult = await paymentClient.search({
                        qs: {
                            external_reference: pedido_id
                        }
                    });
                    
                    if (searchResult && searchResult.paging && searchResult.paging.total > 0) {
                        infoMercadoPago = searchResult.results[0];
                    }
                } catch (mpError) {
                    console.error('Error al consultar Mercado Pago:', mpError);
                }
            }
            
            return res.status(200).json({
                ok: true,
                pagos,
                ultimoPago,
                mercadoPago: infoMercadoPago
            });
            
        } catch (error) {
            console.error('Error al obtener estado de pago:', error);
            return res.status(500).json({
                ok: false,
                msg: 'Error al obtener el estado del pago',
                error: error.message
            });
        }
    }
};

module.exports = mercadoPagoController;