const ProductModel = require('../dao/models/product.model');

class ProductsStorage {

    constructor(){}

    async getAll(){
        return ProductModel.find()
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
        const product = await ProductModel.create({
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnail
        })
        return product
    }

    async deleteById(id){
        const product = await ProductModel.findById(id)
        if(!product){
            throw new Error('not found')
        }
        await ProductModel.deleteOne({ _id: id })

        return (product, ' deleted')
    }

    async findByCode(code){
        const product = await ProductModel.findOne({ code: code })
        return product
    }
}

module.exports = ProductsStorage