const passport = require('passport');
const LocalStartegy = require('passport-local').Strategy;

// referencia al modelo donde vamos a autenticar
const Usuarios = require('../models/Usuarios');

// local strategy - login con credenciales propias
passport.use(
    new LocalStartegy(
        // por default passport espera un usuario y password
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            console.log(email, password);
            try {
                const usuario = await Usuarios.findOne({
                    where: {
                        email,
                        activo: 1
                    }
                });
                // el usuario existe pero el password es incorrecto
                if (!usuario.verificarPassword(password)) {
                    return done(null, null, {
                        message: 'Password incorrecto'
                    })
                }
                // el email existe y el password es correcto
                return done(null, usuario)
            } catch (error) {
                // ese usuario no existe
                return done(null, null, {
                    message: 'Esa cuenta no existe'
                })
            }
        }
    )
);

// serializar el usuario 
passport.serializeUser((usuario, callback) => {
    callback(null, usuario)
})

// deserializar el usuario
passport.deserializeUser((usuario, callback) => {
    callback(null, usuario)
})

// exportar

module.exports = passport;