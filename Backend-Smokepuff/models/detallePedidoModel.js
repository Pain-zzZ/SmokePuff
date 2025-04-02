// models/detallePedidoModel.js
const { DataTypes } = require('sequelize');
const { bdmysql } = require('../database/MySqlConnection');
const Pedido = require('./pedidoModel');
const Producto = require('./productoModel');

const DetallePedido = bdmysql.define('DetallePedido', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    pedido_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Pedido,
            key: 'id'
        }
    },
    producto_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Producto,
            key: 'id'
        }
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    precio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
}, {
    tableName: 'detalles_pedido',
    timestamps: false
});

// Establecer relaciones
DetallePedido.belongsTo(Pedido, { foreignKey: 'pedido_id' });
Pedido.hasMany(DetallePedido, { foreignKey: 'pedido_id' });

DetallePedido.belongsTo(Producto, { foreignKey: 'producto_id' });
Producto.hasMany(DetallePedido, { foreignKey: 'producto_id' });

module.exports = DetallePedido;