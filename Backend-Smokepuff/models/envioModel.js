// models/envioModel.js
const { DataTypes } = require('sequelize');
const { bdmysql } = require('../database/MySqlConnection');
const Pedido = require('./pedidoModel');

const Envio = bdmysql.define('Envio', {
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
    direccion_envio: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    estado_envio: {
        type: DataTypes.ENUM('pendiente', 'en_proceso', 'enviado', 'entregado', 'devuelto'),
        defaultValue: 'pendiente'
    },
    fecha_envio: {
        type: DataTypes.DATE
    }
}, {
    tableName: 'envios',
    timestamps: false
});

// Establecer relación con Pedido
Envio.belongsTo(Pedido, { foreignKey: 'pedido_id' });
Pedido.hasOne(Envio, { foreignKey: 'pedido_id' });

module.exports = Envio;