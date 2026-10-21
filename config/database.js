// La configuración sensible se lee de variables de entorno; nunca se versiona.
const secret = process.env.JWT_SECRET;

if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET debe estar definido y tener al menos 32 caracteres');
}

module.exports = {
    database: process.env.MONGODB_URI || 'mongodb://localhost:27017/upiiz',
    secret: secret
}
