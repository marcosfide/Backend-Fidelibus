const passport = require('passport');
const {Strategy} = require('passport-local');
const User = require('../dao/models/user.model');
const Cart = require('../dao/models/cart.model');
const hashingUtils = require('../utils/hashing');
const { ObjectId } = require('mongodb');


const initializeStrategy = () => {

    passport.use('register', new Strategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async (req, username, password, done) => {

        const {firstName, lastName, age, email} = req.body

        try {
            const user = await User.findOne({email: username})
            if(user){
                //error si el usuario con ese email ya existe
                return done(null, false)
            }

            const newCart = await Cart.create({products:[]})
            const newUser = {
                firstName,
                lastName,
                age: +age,
                email,
                rol: 'User',
                password: hashingUtils.hashPassword(password),
                cart: newCart._id
            }
            const result = await User.create(newUser)
            //usuario nuevo creado correctamente
            return done(null, result)

        } catch (err) {
            //error inesperado
            done(err)
        }

    }))

    passport.use('login', new Strategy({
        usernameField: 'email'
    }, async (username, password, done) => {

        try {
        
            if(!username || !password){
                return done(null, false)
            }
            let user
            // Crea un nuevo ID de MongoDB
            const newId = new ObjectId();
            // Convierte el nuevo ID en una cadena para usarlo en tu objeto de usuario
            const newIdString = newId.toHexString();
            if (username === 'adminCoder@coder.com' && password === 'adminCod3r123') {
                const user = {
                    firstName: 'Administrador',
                    lastName: 'Primero',
                    age: 28,
                    email: 'adminCoder@coder.com',
                    password: 'adminCod3r123',
                    rol: 'Admin',
                    _id: newIdString
                };
                return done(null, user);
            }
            
            // verificar que el usuaria exista en la db
            user = await User.findOne({ email: username });
            if (!user) {
                return done(null, false)
            }
    
            // validar su password
            if(!hashingUtils.isValidPassword(password, user.password)){
                return done(null, false)
            }
    
            return done(null, user)
            
        } catch (err) {
            return done(err)
        }
    }))

    passport.serializeUser((user, done) => {
        console.log('serialized!', user)
        done(null, user._id)
    })

    passport.deserializeUser( async (id, done) => {
        const user = await User.findById(id)
        done(null, user)
    })
}


module.exports = initializeStrategy