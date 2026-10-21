const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
const configdb = require('../config/database');

module.exports = function(passport){
    let opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = configdb.secret;
    opts.algorithms = ['HS256'];
    passport.use(new JwtStrategy(opts, async (jwt_payload, done) =>{
        try {
            const user = await User.getUserById(jwt_payload.sub);
            return done(null, user || false);
        } catch (err) {
            return done(err, false);
        }
    }));
}
