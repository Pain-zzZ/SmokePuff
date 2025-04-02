// controllers/notificacionesController.js
const { Notificacion, Cliente, Pedido } = require('../models');

const obtenerNotificaciones = async (req, res) => {
    try {
        const notificaciones = await Notificacion.findAll({
            include: [
                { model: Cliente, attributes: ['nombre', 'correo'] },
                { model: Pedido }
            ]
        });
        res.json(notificaciones);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error al obtener notificaciones' });
    }
};

const obtenerNotificacionesPorCliente = async (req, res) => {
    const { clienteId } = req.params;
    
    try {
        const notificaciones = await Notificacion.findAll({
            where: { cliente_id: clienteId },
            include: [{ model: Pedido }]
        });
        
        res.json(notificaciones);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error al obtener notificaciones por cliente' });
    }
};

const crearNotificacion = async (req, res) => {
    const { cliente_id, pedido_id, mensaje, tipo } = req.body;
    
    try {
        const notificacion = await Notificacion.create({
            cliente_id,
            pedido_id,
            mensaje,
            tipo,
            estado: 'enviado'
        });
        
        res.status(201).json(notificacion);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error al crear notificación' });
    }
};

const marcarLeida = async (req, res) => {
    const { id } = req.params;
    
    try {
        const notificacion = await Notificacion.findByPk(id);
        if (!notificacion) {
            return res.status(404).json({ msg: 'Notificación no encontrada' });
        }
        
        await notificacion.update({ estado: 'leido' });
        res.json(notificacion);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error al marcar notificación como leída' });
    }
};

module.exports = {
    obtenerNotificaciones,
    obtenerNotificacionesPorCliente,
    crearNotificacion,
    marcarLeida
};