// routes/productos.js
const { Router } = require('express');
const { 
    obtenerProductos, 
    obtenerProducto, 
    crearProducto, 
    actualizarProducto, 
    eliminarProducto 
} = require('../controllers/productosController');

const router = Router();

router.get('/', obtenerProductos);
router.get('/:id', obtenerProducto);
router.post('/', crearProducto);
router.put('/:id', actualizarProducto);
router.delete('/:id', eliminarProducto);

module.exports = router;