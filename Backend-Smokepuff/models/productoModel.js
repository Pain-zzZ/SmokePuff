// models/productoModel.js
const { DataTypes } = require('sequelize');
const { bdmysql } = require('../database/MySqlConnection');

const Producto = bdmysql.define('Producto', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT
    },
    precio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    imagen_url: {
        type: DataTypes.STRING(500)
    },
    categoria: {
        type: DataTypes.STRING(100)
    },
    fecha_creacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'productos',
    timestamps: false
});

module.exports = Producto;