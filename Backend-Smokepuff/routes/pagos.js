// routes/pagos.js
const { Router } = require('express');
const { 
    obtenerPagos, 
    obtenerPago,  
    actualizarPago 
} = require('../controllers/pagosController');

// Importamos el controlador de Mercado Pago
const { 
    crearCheckoutPro,
    procesarWebhook,
    obtenerEstadoPago
} = require('../controllers/mercadoPagoController');

const router = Router();

// Rutas existentes
router.get('/', obtenerPagos);
router.get('/:id', obtenerPago);
router.put('/:id', actualizarPago);

// Rutas para Mercado Pago Checkout Pro
router.post('/checkout', crearCheckoutPro);
router.post('/webhook', procesarWebhook);
router.get('/estado/:pedido_id', obtenerEstadoPago);

module.exports = router;