const mongoose = require('mongoose');

class SessionsService {

    constructor(storage){
        this.storage = storage
    }

    async createSession(req, userSession){
        this.storage.createSession(req, userSession)
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

    async getByEmail(email){
        return this.storage.getByEmail(email);
    }
}

module.exports = { SessionsService }