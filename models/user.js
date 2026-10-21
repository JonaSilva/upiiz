const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//User schema
const UserSchema = mongoose.Schema({
    apellidoP: { type: String, required:true },
    apellidoM: { type: String, required: true },
    nombre: { type: String, required: true },
    telefonoF: { type: Number, required: true },
    telefonoC: { type: Number, required: true },
    username: { type: String, required: true, unique: true },
    bachillerato: { type: String, required: true },
    preparatoria: { type: String, required: true },
    municipio: { type: String, required: true },
    turnoActual: { type: String, required: true },
    turnoCurso: { type: String, required: true },
    carreraUno: { type: String, required: true },
    carreraDos: { type: String, required: true },
    carreraTres: { type: String, required: true },
    // select:false evita que el hash se devuelva en consultas por defecto
    password: { type: String, required: true, select: false }
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = function (id){
    if (!mongoose.isValidObjectId(id)) return Promise.resolve(null);
    return User.findById(id);
}

module.exports.getUserByUsername = function (username, withPassword){
    // Forzar string evita inyección de operadores ($ne, $gt, ...)
    const query = User.findOne({ username: String(username) });
    return withPassword ? query.select('+password') : query;
}

module.exports.addUser = async function (newUser){
    newUser.password = await bcrypt.hash(newUser.password, 10);
    return newUser.save();
}

module.exports.comparePassword = function(candidatePassword, hash){
    return bcrypt.compare(String(candidatePassword), hash);
}
