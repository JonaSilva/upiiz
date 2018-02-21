const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const configdb = require('../config/database');

//User schema
const UserSchema = mongoose.Schema({
    apellidoP: { type: String, required:true },
    apellidoM: { type: String, required: true },
    nombre: { type: String, required: true },
    telefonoF: { type: Number, required: true },
    telefonoC: { type: Number, required: true },
    username: { type: String, required: true },
    bachillerato: { type: String, required: true },
    preparatoria: { type: String, required: true },
    municipio: { type: String, required: true },
    turnoActual: { type: String, required: true },
    turnoCurso: { type: String, required: true },
    carreraUno: { type: String, required: true },
    carreraDos: { type: String, required: true },
    carreraTres: { type: String, required: true },
    password: { type: String }
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = function (id, callback) {
    User.findById(id, callback);
}

module.exports.getUserByUsername = function (username, callback){
    const query = {username: username}
    User.findOne(query, callback);
}

module.exports.addUser = function (newUser, callback){
    bcrypt.genSalt(10, function(err, salt){
        bcrypt.hash(newUser.password, salt, function(err, hash){
           if(err) throw err;
           newUser.password = hash;
            newUser.save(callback); 
        });
    });
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, (err, isMatch)=>{
        if(err) throw err;
        callback(null, isMatch);
    });
}