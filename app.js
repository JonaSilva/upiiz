const express = require('express');
const path = require('path');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const configdb = require('./config/database');

mongoose.set('sanitizeFilter', true);
mongoose.connect(configdb.database).catch((err) => {
    console.error('Error al conectar a la base de datos', err.message);
    process.exit(1);
});

mongoose.connection.on('connected', () => {
    console.log("Conectado a la base de datos");
});

const app = express();

const users = require('./routes/users');

const port = process.env.PORT || 3000;

app.disable('x-powered-by');

// Solo los orígenes listados en CORS_ORIGIN (separados por coma) pueden llamar a la API
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:4200').split(',').map(o => o.trim());
app.use(cors({ origin: allowedOrigins }));

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({extended:false, limit: '10kb'}));

app.use(express.json({limit: '10kb'}));

app.use(passport.initialize());

require('./config/passport')(passport);

app.use('/users', users);

//Index Route
app.get('/', (req, res) =>{
    res.send('Dirección Invalida')
});

// Manejador de errores: no expone trazas al cliente
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({success: false, msg: 'Error interno del servidor'});
});

app.listen(port, () =>{
    console.log('Servidor iniciado');
});
