const mongoose = require('mongoose');
const { CustomError } = require('./errors/CustomError');
const { ErrorCodes } = require('./errors/errorCodes');
const { generateInvalidProductDataError } = require('./products.error');

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

    async createOne(product){
        console.log('Datos recibidos:', product); // Loguear los datos recibidos

        let { title, description, code, price, status, stock, category, thumbnail } = product;

        if(!title || title === '' || !description || description === '' || !code || code === '' || !price || price === '' || !stock || stock === '' || !category || category === '' || !thumbnail || thumbnail === ''){
            throw CustomError.createError({
                name: 'InvalidProductData',
                cause: generateInvalidProductDataError({ title, description, code, price, status, stock, category, thumbnail }),
                message: 'Error trying to create a new product',
                code: ErrorCodes.INVALID_TYPES_ERROR
            })
        }

        const existingProduct = await this.storage.findByCode(code);
        if (existingProduct) {
            console.log(ErrorCodes.DATABASE_ERROR);
            throw CustomError.createError({
                name: 'ExistingCode',
                cause: `El producto con el código ${code} ya se encuentra registrado`,
                message: 'Error trying to create a new product',
                code: ErrorCodes.DATABASE_ERROR
            })
        }

        price = parseFloat(price);
        stock = parseInt(stock, 10);
        product.status = (status === 'true') || (status === true); // Asegurar que status es booleano

        return this.storage.createOne(product)
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