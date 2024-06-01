const mongoose = require('mongoose');

class ProductsService {

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

    async deleteById(id){
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('invalid params');
        }
        return this.storage.deleteById(id)
    }

    async createOne({
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnail
    }){
        if(!title || !description || !code || !price || !status || !stock || !category || !thumbnail){
            throw new Error('invalid params')
        }
        return this.storage.createOne({title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnail
        })
    }

    async getStockById(id){
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('invalid params');
        }
        const product = await this.storage.getById(id);
        const stock = product.stock
        return stock
    }

    async updateStockById(id){
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('invalid params');
        }
        const product = this.storage.getById(id);
        const stock = product.stock

        return this.storage.updateById(id)
    }

    async subtractFromStock(id,quantity){
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('invalid params');
        }

        const product = await this.storage.getById(id);
        
        product.stock = product.stock - quantity

        return await this.storage.updateOne(product)
    }

    async findByCode(code){
        return this.storage.findByCode(code)
    }

}

module.exports = { ProductsService }