// models/notificacionModel.js
const { DataTypes } = require('sequelize');
const { bdmysql } = require('../database/MySqlConnection');
const Pedido = require('./pedidoModel');
const Cliente = require('./clienteModel');

const Notificacion = bdmysql.define('Notificacion', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    pedido_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Pedido,
            key: 'id'
        }
    },
    cliente_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Cliente,
            key: 'id'
        }
    },
    mensaje: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    tipo: {
        type: DataTypes.ENUM('pedido', 'pago', 'envio', 'sistema'),
        defaultValue: 'sistema'
    },
    estado: {
        type: DataTypes.ENUM('enviado', 'leido', 'fallido'),
        defaultValue: 'enviado'
    },
    fecha_envio: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'notificaciones',
    timestamps: false
});

// Establecer relaciones
Notificacion.belongsTo(Pedido, { foreignKey: 'pedido_id' });
Pedido.hasMany(Notificacion, { foreignKey: 'pedido_id' });

Notificacion.belongsTo(Cliente, { foreignKey: 'cliente_id' });
Cliente.hasMany(Notificacion, { foreignKey: 'cliente_id' });

module.exports = Notificacion;