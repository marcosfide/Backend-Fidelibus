const passport = require('passport');
const { Strategy } = require('passport-github2');
const User = require('../dao/models/user.model');
const Cart = require('../dao/models/cart.model');
// const hashingUtils = require('../utils/hashing');
const { clientID, clientSecret, callbackURL } = require('./github.private');

const initializeGithubStrategy = () => {
    passport.use('github', new Strategy({
        clientID,
        clientSecret,
        callbackURL
    }, async (_accessToken, _refreshToken, profile, done) => {
        try {
            console.log('Profile github: ', profile, profile._json);

            let user = await User.findOne({ email: profile._json.email });
            const now = new Date();

            if (user) {
                // Actualizar last_connection si el usuario existe
                user.last_connection = now;
                await user.save(); // Guardar el cambio en la base de datos
                return done(null, user);
            }

            // Crear el usuario, ya que no existe
            const fullName = profile._json.name;
            const firstName = fullName.substring(0, fullName.lastIndexOf(' '));
            const lastName = fullName.substring(fullName.lastIndexOf(' ') + 1);

            const newCart = await Cart.create({ products: [] });

            let newUser = {
                firstName,
                lastName,
                age: 30,
                email: profile._json.email,
                rol: 'User',
                password: '',
                cart: newCart._id,
                last_connection: now // Establecer la conexión inicial
            };
            const result = await User.create(newUser);
            done(null, result);
        }
        catch (err) {
            done(err);
        }
    }));

    passport.serializeUser((user, done) => {
        console.log('serialized!', user);
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        const user = await User.findById(id);
        done(null, user);
    });
};

module.exports = initializeGithubStrategy;
