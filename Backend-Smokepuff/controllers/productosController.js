const { Producto } = require('../models');

const obtenerProductos = async (req, res) => {
    try {
        const productos = await Producto.findAll();
        res.json(productos);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error al obtener productos' });
    }
};

const obtenerProducto = async (req, res) => {
    const { id } = req.params;
    try {
        const producto = await Producto.findByPk(id);
        if (!producto) {
            return res.status(404).json({ msg: 'Producto no encontrado' });
        }
        res.json(producto);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error al obtener producto' });
    }
};

const crearProducto = async (req, res) => {
    try {
        const producto = await Producto.create(req.body);
        res.status(201).json(producto);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error al crear producto' });
    }
};

const actualizarProducto = async (req, res) => {
    const { id } = req.params;
    try {
        const producto = await Producto.findByPk(id);
        if (!producto) {
            return res.status(404).json({ msg: 'Producto no encontrado' });
        }
        await producto.update(req.body);
        res.json(producto);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error al actualizar producto' });
    }
};

const eliminarProducto = async (req, res) => {
    const { id } = req.params;
    try {
        const producto = await Producto.findByPk(id);
        if (!producto) {
            return res.status(404).json({ msg: 'Producto no encontrado' });
        }
        await producto.destroy();
        res.json({ msg: 'Producto eliminado correctamente' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error al eliminar producto' });
    }
};

module.exports = {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    eliminarProducto
};