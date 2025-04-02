// routes/envios.js
const { Router } = require('express');
const { 
    obtenerEnvios, 
    obtenerEnvio, 
    crearEnvio, 
    actualizarEstadoEnvio 
} = require('../controllers/enviosController');

const router = Router();

router.get('/', obtenerEnvios);
router.get('/:id', obtenerEnvio);
router.post('/', crearEnvio);
router.put('/:id', actualizarEstadoEnvio);

module.exports = router;