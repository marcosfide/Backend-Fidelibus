const mongoose = require('mongoose');

class SessionsService {

    constructor(storage, usersStorage){
        this.storage = storage
        this.usersStorage = usersStorage;
    }

    async createSession(req, userSession){
        this.storage.createSession(req, userSession)
        await this.updateLastConnection(userSession._id); 
    }

    async updateLastConnection(userId) {
        const now = new Date();
        await this.usersStorage.updateOne(userId, { last_connection: now });
    }

    async updatePassword(email, password){
        this.storage.updatePassword(email, password)
    }

    async getById(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('invalid params');
        }
        return this.storage.getById(id);
    }
}

module.exports = { SessionsService }