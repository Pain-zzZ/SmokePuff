// models/clienteModel.js
const { DataTypes } = require('sequelize');
const { bdmysql } = require('../database/MySqlConnection');

const Cliente = bdmysql.define('Cliente', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    correo: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    },
    telefono: {
        type: DataTypes.STRING(20)
    },
    direccion: {
        type: DataTypes.TEXT
    },
    fecha_registro: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'clientes',
    timestamps: false
});

module.exports = Cliente;