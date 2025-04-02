// controllers/pedidosController.js
const { Pedido, Cliente, DetallePedido, Producto } = require('../models');

const obtenerPedidos = async (req, res) => {
    try {
        const pedidos = await Pedido.findAll({
            include: [
                { model: Cliente, attributes: ['nombre', 'correo'] },
                { 
                    model: DetallePedido,
                    include: [{ model: Producto, attributes: ['nombre', 'precio'] }] 
                }
            ]
        });
        res.json(pedidos);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error al obtener pedidos' });
    }
};

const obtenerPedido = async (req, res) => {
    const { id } = req.params;
    try {
        const pedido = await Pedido.findByPk(id, {
            include: [
                { model: Cliente, attributes: ['nombre', 'correo'] },
                { 
                    model: DetallePedido,
                    include: [{ model: Producto, attributes: ['nombre', 'precio'] }] 
                }
            ]
        });
        
        if (!pedido) {
            return res.status(404).json({ msg: 'Pedido no encontrado' });
        }
        
        res.json(pedido);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error al obtener pedido' });
    }
};

const crearPedido = async (req, res) => {
    const { cliente_id, productos, total } = req.body;
    
    try {
        // Verificar que el cliente existe
        const cliente = await Cliente.findByPk(cliente_id);
        if (!cliente) {
            return res.status(404).json({ msg: 'Cliente no encontrado' });
        }
        
        // Crear pedido
        const pedido = await Pedido.create({
            cliente_id,
            total,
            estado: 'pendiente'
        });
        
        // Crear detalles del pedido
        if (productos && productos.length > 0) {
            const detalles = productos.map(prod => ({
                pedido_id: pedido.id,
                producto_id: prod.producto_id,
                cantidad: prod.cantidad,
                precio: prod.precio
            }));
            
            await DetallePedido.bulkCreate(detalles);
        }
        
        // Retornar pedido con sus detalles
        const pedidoCompleto = await Pedido.findByPk(pedido.id, {
            include: [
                { model: Cliente, attributes: ['nombre', 'correo'] },
                { 
                    model: DetallePedido,
                    include: [{ model: Producto, attributes: ['nombre', 'precio'] }] 
                }
            ]
        });
        
        res.status(201).json(pedidoCompleto);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error al crear pedido' });
    }
};

const actualizarPedido = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    
    try {
        const pedido = await Pedido.findByPk(id);
        if (!pedido) {
            return res.status(404).json({ msg: 'Pedido no encontrado' });
        }
        
        await pedido.update({ estado });
        res.json(pedido);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error al actualizar pedido' });
    }
};

const eliminarPedido = async (req, res) => {
    const { id } = req.params;
    
    try {
        const pedido = await Pedido.findByPk(id);
        if (!pedido) {
            return res.status(404).json({ msg: 'Pedido no encontrado' });
        }
        
        // También eliminar los detalles del pedido (si se desea eliminación en cascada)
        await DetallePedido.destroy({ where: { pedido_id: id } });
        
        await pedido.destroy();
        res.json({ msg: 'Pedido eliminado correctamente' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error al eliminar pedido' });
    }
};

module.exports = {
    obtenerPedidos,
    obtenerPedido,
    crearPedido,
    actualizarPedido,
    eliminarPedido
};