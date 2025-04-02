// routes/notificaciones.js
const { Router } = require('express');
const { 
    obtenerNotificaciones, 
    obtenerNotificacionesPorCliente, 
    crearNotificacion, 
    marcarLeida 
} = require('../controllers/notificacionesController');

const router = Router();

router.get('/', obtenerNotificaciones);
router.get('/cliente/:clienteId', obtenerNotificacionesPorCliente);
router.post('/', crearNotificacion);
router.put('/:id/leer', marcarLeida);

module.exports = router;