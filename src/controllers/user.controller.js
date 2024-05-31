const { hashPassword } = require('../utils/hashing');

class UserController {
    
    constructor(service){
        this.service = service
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
}


module.exports = UserController