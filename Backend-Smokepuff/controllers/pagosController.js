// controllers/pagosController.js
const { Pago, Pedido } = require('../models');

const obtenerPagos = async (req, res) => {
    try {
        const pagos = await Pago.findAll({
            include: [{ model: Pedido }]
        });
        res.json(pagos);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error al obtener pagos' });
    }
};

const obtenerPago = async (req, res) => {
    const { id } = req.params;
    try {
        const pago = await Pago.findByPk(id, {
            include: [{ model: Pedido }]
        });
        
        if (!pago) {
            return res.status(404).json({ msg: 'Pago no encontrado' });
        }
        
        res.json(pago);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error al obtener pago' });
    }
};

const crearPago = async (req, res) => {
    const { pedido_id, metodo_pago, referencia_pago } = req.body;
    
    try {
        // Verificar que el pedido existe
        const pedido = await Pedido.findByPk(pedido_id);
        if (!pedido) {
            return res.status(404).json({ msg: 'Pedido no encontrado' });
        }
        
        // Crear pago
        const pago = await Pago.create({
            pedido_id,
            metodo_pago,
            referencia_pago,
            estado_pago: 'completado'
        });
        
        // Actualizar estado del pedido si se requiere
        await pedido.update({ estado: 'procesando' });
        
        // Retornar pago con información del pedido
        const pagoCompleto = await Pago.findByPk(pago.id, {
            include: [{ model: Pedido }]
        });
        
        res.status(201).json(pagoCompleto);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error al crear pago' });
    }
};

const actualizarPago = async (req, res) => {
    const { id } = req.params;
    const { estado_pago } = req.body;
    
    try {
        const pago = await Pago.findByPk(id);
        if (!pago) {
            return res.status(404).json({ msg: 'Pago no encontrado' });
        }
        
        await pago.update({ estado_pago });
        res.json(pago);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error al actualizar pago' });
    }
};

module.exports = {
    obtenerPagos,
    obtenerPago,
    crearPago,
    actualizarPago
};