// routes/pedidos.js
const { Router } = require('express');
const { 
    obtenerPedidos, 
    obtenerPedido, 
    crearPedido, 
    actualizarPedido, 
    eliminarPedido 
} = require('../controllers/pedidosController');

const router = Router();

router.get('/', obtenerPedidos);
router.get('/:id', obtenerPedido);
router.post('/', crearPedido);
router.put('/:id', actualizarPedido);
router.delete('/:id', eliminarPedido);

module.exports = router;