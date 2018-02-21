const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const configdb = require('./config/database');

mongoose.connect(configdb.database);

mongoose.connection.on('connected', () => {
    console.log("Conectado a la base de datos");
});

const app = express();

const users = require('./routes/users');

const port = 3000;

app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({extended:false}));

app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use('/users', users);

//Index Route
app.get('/', (req, res) =>{
    res.send('Dirección Invalida')
});

app.listen(port, () =>{
    console.log('Servidor iniciado');
});
