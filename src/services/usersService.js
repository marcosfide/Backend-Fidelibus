const mongoose = require('mongoose');
const transport = require('../nodemailer-config/transport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

class UsersService {

    constructor(storage){
        this.storage = storage
    }

    async resetPassword(token, password) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const user = await this.storage.getByEmail(decoded.email);
            if (!user) {
                throw new Error('User not found');
            }

            const isSamePassword = await bcrypt.compare(password, user.password);
            if (isSamePassword) {
                throw new Error('No se puede ingresar la misma contraseña con la que está registrado el usuario');
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            await this.storage.updatePassword(decoded.email, { password: hashedPassword });

            return { success: true };
        } catch (error) {
            throw error;
        }
    }

    async getById(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('invalid params');
        }
        return this.storage.getById(id);
    }

    async getByEmail(email){
        return this.storage.getByEmail(email);
    }

    async sendEmailToResetPassword(email) {
        await this.storage.getByEmail(email);

        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
        const resetLink = `http://localhost:8080/resetPassword?token=${token}`;
        
        return await transport.sendMail({
            from: 'Marcos',
            to: email,
            html: `
                <div>
                    <p>Mail para reestablecer password</p>
                    <a href="${resetLink}">Restablecer contraseña</a>
                </div>
            `,
            subject: 'Prueba de resetPassword'
        });
    }

    async changeRol(userId){
        try {
            const user = await this.storage.getById(userId);
            if (!user) {
                throw new Error('User not found');
            }
    
            // Cambiar el rol del usuario
            let newRole;
            if (user.rol === 'User') {
                newRole = 'Premium';
            } else if (user.rol === 'Premium') {
                newRole = 'User';
            } else {
                throw new Error('Invalid role');
            }
    
            // Crear un nuevo objeto de usuario con el rol actualizado
            const newUserData = {
                ...user,
                rol: newRole
            };
    
            // Actualizar el usuario en el almacenamiento
            await this.storage.updateOne(userId, newUserData);
    
            console.log('User role updated successfully');
        } catch (error) {
            console.error('Error updating user role:', error);
        }
    }
}

module.exports = { UsersService }