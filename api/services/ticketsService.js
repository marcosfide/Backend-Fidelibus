const mongoose = require('mongoose');

class TicketsService {

    constructor(storage){
        this.storage = storage
    }

    async getAll(){
        return this.storage.getAll()
    }

    async getById(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('invalid params');
        }
        return this.storage.getById(id);
    }

    async createOne(ticketData){
        return this.storage.createOne(ticketData)
    }
}

module.exports = { TicketsService }