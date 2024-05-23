const { hashPassword } = require('../utils/hashing');
const { emailAdmin } = require ('../env-config/adminConfig');

class SesionController {
    
    constructor(service){
        this.service = service
    }

    async createSession(req, res){
        const userSession = { email: req.user.email, _id: req.user._id }
        await this.service.createSession(req, userSession)
        res.redirect('/');
    }

    async deleteSession(req, res){
        req.session.destroy(err => {
            res.redirect('/')
        })
    }

    async register(req, res){
        console.log('usuario: ', req.user);
        res.redirect('/')
    }

    async resetPassword(req, res){
        const {email, password} = req.body
        if(!email || !password){
            return res.status(400).json({error: 'Invalid credentials'})
        }
        const user = await this.service.getByEmail( email );
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }
        
        await this.service.updatePassword(email, {$set: {password: hashPassword(password)}})
    
        res.redirect('/')
    }

    async getCurrent(req, res){
        if (!req.session.user || !req.session.user._id) {
            return res.status(401).send('Unauthorized');
        }
        try {
            let user;
            // Verificar si el usuario autenticado es administrativo
            if (req.session.user.email === emailAdmin) {
                // Utilizar el objeto de usuario administrativo creado dinámicamente
                user = {
                    firstName: 'Administrador',
                    lastName: 'Primero',
                    age: 28,
                    email: emailAdmin,
                    rol: 'Admin'
                };
            } else {
                // Buscar el usuario en la base de datos
                const idFromSession = req.session.user._id;
                user = await this.service.getById(idFromSession);
                if (!user) {
                    return res.status(404).send('User not found');
                }
            }
    
            res.status(200).json(user);
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    }
    
}


module.exports = SesionController