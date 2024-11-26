const UserModel = require('../dao/models/user.model');

class UsersStorage {

    constructor(){}

    async updatePassword(email, password){
        await UserModel.updateOne({email}, password)
    }

    async getUsers() {
        // Selecciona solo los campos firstName, lastName, email, y rol
        const users = await UserModel.find().select('firstName lastName email rol last_connection');
        return users;
    }

    async getById(id){
        const user = await UserModel.findOne({ _id: id }).lean();
        if(!user){
            throw new Error('not found')
        }
        return user
    }

    async getByEmail(email){
        const user = await UserModel.findOne({ email });
        if(!user){
            throw new Error('not found')
        }
        return user
    }

    async updateOne(userId, newUserData) {
        await UserModel.updateOne({ _id: userId }, { $set: newUserData });
    }

    async deleteInactiveUsers() {
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    
        const usersToDelete = await UserModel.find({ last_connection: { $lt: twoDaysAgo } });
    
        const result = await UserModel.deleteMany({ last_connection: { $lt: twoDaysAgo } });
    
        return usersToDelete;
    }
    
    async getInactiveUsers(cutoffDate) {
        return await UserModel.find({ last_connection: { $lt: cutoffDate } });
    }    

    async deleteById(id){
        const user = await UserModel.findById(id)
        if(!user){
            throw new Error('not found')
        }
        await UserModel.deleteOne({ _id: id })

        return (user, ' deleted')
    }
}

module.exports = UsersStorage