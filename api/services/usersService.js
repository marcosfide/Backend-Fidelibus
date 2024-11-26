const mongoose = require('mongoose');
const transport = require('../nodemailer-config/transport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { isValid, format } = require('date-fns');

class UsersService {

    constructor(storage,productStorage,cartStorage){
        this.storage = storage
        this.productStorage = productStorage
        this.cartStorage = cartStorage
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

    async getUsers() {
        const users = await this.storage.getUsers();
    
        const formattedUsers = users.map(user => {
            // Imprimir el valor de last_connection para depuración
            console.log('last_connection value:', user._doc.last_connection);
    
            // Verifica si el campo last_connection es válido
            const lastConnectionDate = new Date(user._doc.last_connection);
            const isValidDate = isValid(lastConnectionDate);
    
            return {
                ...user._doc,
                last_connection: isValidDate ? format(lastConnectionDate, 'HH:mm dd/MM/yyyy') : 'No disponible'
            };
        });
    
        return formattedUsers;
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

        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
        const resetLink = `${process.env.BASE_URL}resetPassword?token=${token}`;
        
        return await transport.sendMail({
            from: 'Marcos',
            to: email,
            html: `
                <div>
                    <p>Mail para reestablecer password</p>
                    <a href="${resetLink}">Restablecer contraseña</a>
                </div>
            `,
            subject: 'Reestablecer la contraseña'
        });
    }

    async sendEmailToUserDeleted(email) {
        
        return await transport.sendMail({
            from: 'Marcos',
            to: email,
            html: `
                <div>
                    <p>Su usuario ha sido eliminado del ecommerce.</p>
                </div>
            `,
            subject: 'Usuario eliminado'
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

    async addImage(userId, file) {
        try {
            const user = await this.storage.getById(userId);
            if (!user) {
                throw new Error('Usuario no encontrado');
            }
    
            if (!Array.isArray(user.documents)) {
                user.documents = [];
            }
    
            const newDocument = {
                name: file.originalname,
                reference: `/files/${file.filename}` // Ruta accesible
            };
    
            user.documents.push(newDocument);
            await this.storage.updateOne(userId, { documents: user.documents });
        } catch (error) {
            console.log(error);
            throw new Error('Error al actualizar los documentos del usuario');
        }
    }

    async deleteInactiveUsers() {
        // Obtener usuarios inactivos (sin conexión en más de dos días)
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
        
        // Encuentra todos los usuarios inactivos
        const usersToDelete = await this.storage.getInactiveUsers(twoDaysAgo);
    
        for (const user of usersToDelete) {
            const email = user.email;
            const cartId = user.cart;
            
            // Eliminar el carrito del usuario si existe
            if (cartId) {
                await this.cartStorage.deleteById(cartId);
            }
    
            // Obtener y eliminar todos los productos del usuario
            const userProducts = await this.productStorage.getByOwner(email);
            for (const product of userProducts) {
                await this.productStorage.deleteById(product._id);
            }
    
            // Eliminar el usuario
            await this.storage.deleteById(user._id);
    
            // Enviar correo al usuario eliminado
            await this.sendEmailToUserDeleted(email);
        }
    
        return { deletedCount: usersToDelete.length };
    }    

    async deleteById(id){
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('invalid params');
        }
        return this.storage.deleteById(id)
    }
    
}

module.exports = { UsersService }