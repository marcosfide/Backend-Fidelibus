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

    async createOne(product){
        return await ProductModel.create(product)
    }

    async deleteById(id){
        const product = await ProductModel.findById(id)
        if(!product){
            throw new Error('not found')
        }
        await ProductModel.deleteOne({ _id: id })

        return (product, ' deleted')
    }

    async updateOne(product){
        const { _id, ...updateData } = product;
        const updatedProduct = await ProductModel.findByIdAndUpdate(_id, updateData, { new: true, runValidators: true });
        if (!updatedProduct) {
            throw new Error('not found');
        }
        return updatedProduct;
    }

    async findByCode(code){
        const product = await ProductModel.findOne({ code: code })
        return product
    }
}

module.exports = ProductsStorage