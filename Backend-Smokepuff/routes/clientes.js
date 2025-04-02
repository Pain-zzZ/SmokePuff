// routes/clientes.js
const { Router } = require('express');
const { 
    obtenerClientes, 
    obtenerCliente, 
    crearCliente, 
    actualizarCliente, 
    eliminarCliente 
} = require('../controllers/clientesController');

const router = Router();

router.get('/', obtenerClientes);
router.get('/:id', obtenerCliente);
router.post('/', crearCliente);
router.put('/:id', actualizarCliente);
router.delete('/:id', eliminarCliente);

module.exports = router;