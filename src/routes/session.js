const Router = require('./router')
const User = require('../dao/models/user.model');
const { hashPassword } = require('../utils/hashing');
const passport = require('passport');

class SessionRouter extends Router {
    init() {

        this.post('/login', passport.authenticate('login', {failureRedirect: '/api/session/faillogin'}), async (req, res) => {
        
            // crear nueva session
            req.session.user = { email: req.user.email, _id: req.user._id };
            res.redirect('/');
            
        });
        
        this.get('/faillogin', (req,res) => {
            res.send('Error logging in user!')
        })
        
        this.post('/resetPassword', async (req, res) =>{
            const {email, password} = req.body
            if(!email || !password){
                return res.status(400).json({error: 'Invalid credentials'})
            }
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ error: 'User not found' });
            }
        
            await User.updateOne({email}, {$set: {password: hashPassword(password)}})
        
            res.redirect('/')
        })
        
        this.get('/logout', (req, res) => {
            req.session.destroy(err => {
                res.redirect('/')
            })
        })
        
        this.post('/register', passport.authenticate('register', {failureRedirect: '/api/session/failregister'}), async (req, res) => {
            console.log('usuario: ', req.user);
            res.redirect('/')
        })
        
        this.get('/failregister', (req,res) => {
            res.send('User is already registered!')
        })
        
        this.get('/github', passport.authenticate('github', {scope: ['user:email']}), (req, res) => {})
        
        this.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/'}), (req,res) => {
            req.session.user = {_id: req.user._id}
            res.redirect('/')
        })
                
        this.get('/current', async (req, res) => {
            if (!req.session.user || !req.session.user._id) {
                return res.status(401).send('Unauthorized');
            }
        
            try {
                let user;
        
                // Verificar si el usuario autenticado es administrativo
                if (req.session.user.email === 'adminCoder@coder.com') {
                    // Utilizar el objeto de usuario administrativo creado dinámicamente
                    user = {
                        firstName: 'Administrador',
                        lastName: 'Primero',
                        age: 28,
                        email: 'adminCoder@coder.com',
                        rol: 'Admin'
                    };
                } else {
                    // Buscar el usuario en la base de datos
                    const idFromSession = req.session.user._id;
                    user = await User.findOne({ _id: idFromSession });
                    if (!user) {
                        return res.status(404).send('User not found');
                    }
                }
        
                res.status(200).json(user);
            } catch (error) {
                console.error(error);
                res.status(500).send('Internal Server Error');
            }
        });

    }
}

module.exports = SessionRouter