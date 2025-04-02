// controllers/clientesController.js
const { Cliente } = require('../models');

const obtenerClientes = async (req, res) => {
    try {
        const clientes = await Cliente.findAll();
        res.json(clientes);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error al obtener clientes' });
    }
};

const obtenerCliente = async (req, res) => {
    const { id } = req.params;
    try {
        const cliente = await Cliente.findByPk(id);
        if (!cliente) {
            return res.status(404).json({ msg: 'Cliente no encontrado' });
        }
        res.json(cliente);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error al obtener cliente' });
    }
};

const crearCliente = async (req, res) => {
    try {
        const cliente = await Cliente.create(req.body);
        res.status(201).json(cliente);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error al crear cliente' });
    }
};

const actualizarCliente = async (req, res) => {
    const { id } = req.params;
    try {
        const cliente = await Cliente.findByPk(id);
        if (!cliente) {
            return res.status(404).json({ msg: 'Cliente no encontrado' });
        }
        await cliente.update(req.body);
        res.json(cliente);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error al actualizar cliente' });
    }
};

const eliminarCliente = async (req, res) => {
    const { id } = req.params;
    try {
        const cliente = await Cliente.findByPk(id);
        if (!cliente) {
            return res.status(404).json({ msg: 'Cliente no encontrado' });
        }
        await cliente.destroy();
        res.json({ msg: 'Cliente eliminado correctamente' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error al eliminar cliente' });
    }
};

module.exports = {
    obtenerClientes,
    obtenerCliente,
    crearCliente,
    actualizarCliente,
    eliminarCliente
};