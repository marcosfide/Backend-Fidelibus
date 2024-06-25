const UserModel = require('../dao/models/user.model');

class UsersStorage {

    constructor(){}

    async updatePassword(email, password){
        await UserModel.updateOne({email}, password)
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
}

module.exports = UsersStorage