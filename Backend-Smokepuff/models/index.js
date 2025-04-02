// models/index.js
const Producto = require('./productoModel');
const Cliente = require('./clienteModel');
const Pedido = require('./pedidoModel');
const DetallePedido = require('./detallePedidoModel');
const Pago = require('./pagoModel');
const Notificacion = require('./notificacionModel');
const Envio = require('./envioModel');


module.exports = {
    Producto,
    Cliente,
    Pedido,
    DetallePedido,
    Pago,
    Notificacion,
    Envio
};