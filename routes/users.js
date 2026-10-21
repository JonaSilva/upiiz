const express = require('express');
const router = express.Router();    
const passport = require('passport');
const jwt = require('jsonwebtoken');
const configdb = require('../config/database');
const User = require('../models/user');

const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;

//Rout de Register

router.post('/register', async (req, res) =>{
    const { username, password } = req.body;

    if (!isNonEmptyString(username) || typeof password !== 'string' || password.length < 8 || password.length > 72) {
        return res.status(400).json({success: false, msg: 'Usuario o contraseña inválidos (la contraseña debe tener entre 8 y 72 caracteres)'});
    }

    let newUser = new User({
        apellidoP: req.body.apeP,
        apellidoM: req.body.apeM,
        nombre: req.body.name,
        telefonoF: req.body.phoneF,
        telefonoC: req.body.phoneC,
        username: username.trim(),
        bachillerato: req.body.bachelor,
        preparatoria: req.body.high,
        municipio: req.body.muni,
        turnoActual: req.body.actualT,
        turnoCurso: req.body.curseTime,
        carreraUno: req.body.firstDegree,
        carreraDos: req.body.secondDegree,
        carreraTres: req.body.thirdDegree,
        password: password
    });

    try {
        await User.addUser(newUser);
        res.json({success: true, msg: 'Usuario registrado con éxito'});
    } catch (err) {
        if (err && err.code === 11000) {
            return res.status(409).json({success: false, msg: 'El usuario ya existe'});
        }
        res.status(400).json({success: false, msg: 'Error al registrar usuario'});
    }
});

router.post('/authenticate', async (req, res, next) => {
    const { username, password } = req.body;

    if (!isNonEmptyString(username) || typeof password !== 'string') {
        return res.status(400).json({success: false, msg: 'Usuario o contraseña incorrectos'});
    }

    try {
        const user = await User.getUserByUsername(username.trim(), true);
        const isMatch = user ? await User.comparePassword(password, user.password) : false;

        // Mismo mensaje en ambos casos para no revelar qué usuarios existen
        if (!isMatch) {
            return res.status(401).json({success: false, msg: 'Usuario o contraseña incorrectos'});
        }

        // El token solo lleva el id; nunca datos personales ni el hash de la contraseña
        const token = jwt.sign({}, configdb.secret, {
            subject: String(user._id),
            algorithm: 'HS256',
            expiresIn: '7d'
        });

        res.json({
            success: true,
            token: 'Bearer '+token,
            user: {
                id: user._id,
                name: user.nombre,
                username: user.username
            }
        });
    } catch (err) {
        next(err);
    }
});

router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res) => {
    res.json({user: req.user});
});

module.exports = router;
