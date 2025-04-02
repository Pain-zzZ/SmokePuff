const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { bdmysql } = require('./database/MySqlConnection');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 8080;
        
        this.paths = {
            productos: '/api/productos',
            clientes: '/api/clientes',
            pedidos: '/api/pedidos',
            pagos: '/api/pagos',
            notificaciones: '/api/notificaciones',
            envios: '/api/envios'
        };

        // Conectar a base de datos
        this.dbConnection();

        // Middlewares
        this.middlewares();

        // Rutas
        this.routes();
    }

    async dbConnection() {
        try {
            await bdmysql.authenticate();
            console.log('Base de datos conectada');
        } catch (error) {
            console.error('Error al conectar a la base de datos:', error);
        }
    }

    middlewares() {
        // CORS
        this.app.use(cors());

        // Lectura y parseo del body
        this.app.use(express.json());

        // Directorio público
        this.app.use(express.static('public'));
    }

    routes() {
        this.app.use(this.paths.productos, require('./routes/productos'));
        this.app.use(this.paths.clientes, require('./routes/clientes'));
        this.app.use(this.paths.pedidos, require('./routes/pedidos'));
        this.app.use(this.paths.pagos, require('./routes/pagos'));
        this.app.use(this.paths.notificaciones, require('./routes/notificaciones'));
        this.app.use(this.paths.envios, require('./routes/envios'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Servidor corriendo en puerto ${this.port}`);
        });
    }
}

module.exports = Server;