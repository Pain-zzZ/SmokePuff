// models/pagoModel.js
const { DataTypes } = require('sequelize');
const { bdmysql } = require('../database/MySqlConnection');
const Pedido = require('./pedidoModel');

const Pago = bdmysql.define('Pago', {
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
    metodo_pago: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    estado_pago: {
        type: DataTypes.ENUM('pendiente', 'procesando', 'completado', 'fallido', 'reembolsado'),
        defaultValue: 'pendiente'
    },
    referencia_pago: {
        type: DataTypes.STRING(255)
    },
    fecha_pago: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'pagos',
    timestamps: false
});

// Establecer relación con Pedido
Pago.belongsTo(Pedido, { foreignKey: 'pedido_id' });
Pedido.hasMany(Pago, { foreignKey: 'pedido_id' });

module.exports = Pago;