const express = require('express');
const router = express.Router();    
const passport = require('passport');
const jwt = require('jsonwebtoken');
const configdb = require('../config/database');
const User = require('../models/user');

//Rout de Register

router.post('/register', (req, res, next) =>{
    let newUser = new User({
        apellidoP: req.body.apeP,
        apellidoM: req.body.apeM,
        nombre: req.body.name,
        telefonoF: req.body.phoneF,
        telefonoC: req.body.phoneC,
        username: req.body.username,
        bachillerato: req.body.bachelor,
        preparatoria: req.body.high,
        municipio: req.body.muni,
        turnoActual: req.body.actualT,
        turnoCurso: req.body.curseTime,
        carreraUno: req.body.firstDegree,
        carreraDos: req.body.secondDegree,
        carreraTres: req.body.thirdDegree,
        password: req.body.password
    });

    User.addUser(newUser, (err, user) =>{
        if(err){
            res.json({success: false, msg: 'Error al registrar usuario'});
        }else{
            res.json({success: true, msg: 'Usuario registrado con éxito'});
        }
    });
});

router.post('/authenticate', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    User.getUserByUsername(username, (err, user)=>{
        if(err) throw err;
        if(!user){
            return res.json({success:false, msg:"No existe usuario"});
        }

        User.comparePassword(password, user.password, (err, isMatch)=>{
            if(err) throw err;
            if(isMatch){
                const token = jwt.sign({data:user}, configdb.secret, {
                    expiresIn: 60480 //1 week

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
            }else{
                return res.json({success: false, msg: 'Contraseña incorrecta'});
            }
        });
    });
});

router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    res.json({user: req.user});
});

module.exports = router;