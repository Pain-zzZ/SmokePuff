// controllers/enviosController.js
const { Envio, Pedido } = require('../models');

const obtenerEnvios = async (req, res) => {
    try {
        const envios = await Envio.findAll({
            include: [{ model: Pedido }]
        });
        res.json(envios);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error al obtener envíos' });
    }
};

const obtenerEnvio = async (req, res) => {
    const { id } = req.params;
    try {
        const envio = await Envio.findByPk(id, {
            include: [{ model: Pedido }]
        });
        
        if (!envio) {
            return res.status(404).json({ msg: 'Envío no encontrado' });
        }
        
        res.json(envio);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error al obtener envío' });
    }
};

const crearEnvio = async (req, res) => {
    const { pedido_id, direccion_envio } = req.body;
    
    try {
        // Verificar que el pedido existe
        const pedido = await Pedido.findByPk(pedido_id);
        if (!pedido) {
            return res.status(404).json({ msg: 'Pedido no encontrado' });
        }
        
        // Crear envío
        const envio = await Envio.create({
            pedido_id,
            direccion_envio,
            estado_envio: 'pendiente'
        });
        
        // Actualizar estado del pedido
        await pedido.update({ estado: 'enviado' });
        
        // Retornar envío con información del pedido
        const envioCompleto = await Envio.findByPk(envio.id, {
            include: [{ model: Pedido }]
        });
        
        res.status(201).json(envioCompleto);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error al crear envío' });
    }
};

const actualizarEstadoEnvio = async (req, res) => {
    const { id } = req.params;
    const { estado_envio } = req.body;
    
    try {
        const envio = await Envio.findByPk(id, {
            include: [{ model: Pedido }]
        });
        
        if (!envio) {
            return res.status(404).json({ msg: 'Envío no encontrado' });
        }
        
        await envio.update({ 
            estado_envio,
            fecha_envio: estado_envio === 'enviado' ? new Date() : envio.fecha_envio
        });
        
        // Si el envío está marcado como entregado, actualizar el pedido
        if (estado_envio === 'entregado') {
            await envio.Pedido.update({ estado: 'entregado' });
        }
        
        res.json(envio);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error al actualizar estado del envío' });
    }
};

module.exports = {
    obtenerEnvios,
    obtenerEnvio,
    crearEnvio,
    actualizarEstadoEnvio
};