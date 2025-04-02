// models/pedidoModel.js
const { DataTypes } = require('sequelize');
const { bdmysql } = require('../database/MySqlConnection');
const Cliente = require('./clienteModel');

const Pedido = bdmysql.define('Pedido', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    cliente_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Cliente,
            key: 'id'
        }
    },
    total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    estado: {
        type: DataTypes.ENUM('pendiente', 'procesando', 'enviado', 'entregado', 'cancelado'),
        defaultValue: 'pendiente'
    },
    fecha_pedido: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'pedidos',
    timestamps: false
});

// Establecer relación con Cliente
Pedido.belongsTo(Cliente, { foreignKey: 'cliente_id' });
Cliente.hasMany(Pedido, { foreignKey: 'cliente_id' });

module.exports = Pedido;