const { SaveUserResponse } = require('../dto/responses/saveUserResponse');
const { emailAdmin, emailSuperAdmin } = require ('../env-config/adminConfig');

class SesionController {
    
    constructor(service, cartsService){
        this.service = service
        this.cartsService = cartsService
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
            } else if (req.session.user.email === emailSuperAdmin) {
                // Utilizar el objeto de usuario administrativo creado dinámicamente
                user = {
                    firstName: 'Super',
                    lastName: 'Admin',
                    age: 28,
                    email: emailSuperAdmin,
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
            
            res.status(200).json(new SaveUserResponse(user));
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    }
    
}


module.exports = SesionController