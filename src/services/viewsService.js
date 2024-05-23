const mongoose = require('mongoose');

class ViewsService {

    constructor(storage){
        this.storage = storage
    }

    async getAll(){
        return this.storage.getAll()
    }

    async paginate(query, options){
        return this.storage.paginate(query, options)
    }

    async getById(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('invalid params');
        }
        return this.storage.getById(id);
    }
}

module.exports = { ViewsService }