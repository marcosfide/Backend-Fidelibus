const UserModel = require('../dao/models/user.model');

class UsersStorage {

    constructor(){}

    async updatePassword(email, password){
        await UserModel.updateOne({email}, password)
    }

    async getById(id){
        const user = await UserModel.findOne({ _id: id })
        if(!user){
            throw new Error('not found')
        }
        return user
    }

    async getByEmail(email){
        const user = await UserModel.findOne({ email });
        return user
    }

}

module.exports = UsersStorage