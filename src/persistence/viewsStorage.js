const ProductModel = require('../dao/models/product.model');

class ViewsStorage {

    constructor(){}

    async getAll(){
        return this.storage.getAll()
    }

    async paginate(query, options){
        return await ProductModel.paginate(query, options)
    }

    async getById(id){
        const product = await ProductModel.findById(id)
        if(!product){
            throw new Error('not found')
        }
        return product
    }
}

module.exports = ViewsStorage