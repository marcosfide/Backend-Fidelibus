const mongoose = require('mongoose');
const { CustomError } = require('./errors/CustomError');
const { ErrorCodes } = require('./errors/errorCodes');
const { generateInvalidProductDataError } = require('./products.error');
const transport = require('../nodemailer-config/transport');

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

    async getProductsManager(queryParams, userEmail) {
        try {
            let { limit, page, sort, category, availability } = queryParams;
            limit = limit ? limit : 10;
            page = page ? page : 1;
            const query = userEmail === 'adminCoder@coder.com' || userEmail === 'super@admin.com' ? {} : { owner: userEmail };
                
            // Agregar filtro por categoría si está presente
            if (category) {
                query.category = category;
            }
    
            // Agregar filtro por disponibilidad de stock si no se especifica una categoría
            if (availability === 's') {
                query.stock = { $gte: 1 };
            } else if(availability === 'n'){
                query.stock = 0;
            }
    
            const options = {
                limit: limit,
                page: page,
                sort: sort ? { price: sort } : undefined,
                lean: true
            };
            console.log('query', query,'options',options);
    
            const products = await this.storage.paginate(query, options);
    
            // Validar si page no está definido o es menor que 1
            if (isNaN(page) || page < 1 || page > products.totalPages) {
                throw new Error('¡Página no válida!');
            }
    
            return products;
        } catch (error) {
            console.error("Error al obtener productos:", error);
            throw new Error("Error interno del servidor");
        }
    }

    async getById(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('invalid params');
        }
        return this.storage.getById(id);
    }

    async getByOwner(owner) {
        const productsOwner = await this.storage.getByOwner(owner)
        return productsOwner
    }

    async sendEmailForProductDeleted(product, email) {
        
        return await transport.sendMail({
            from: 'Marcos',
            to: email,
            html: `
                <div>
                    <p>Su prducto ${product.title}, código ${product.code} ha sido eliminado del ecommerce.</p>
                </div>
            `,
            subject: 'Producto eliminado'
        });
    }

    async deleteById(id, owner){
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('invalid params');
        }
        const product = await this.getById(id)
        await this.storage.deleteById(id)
        await this.sendEmailForProductDeleted(product,owner)
        return
    }

    async createOne(product){
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

    async updateOne(product) {
        try {
            return await this.storage.updateOne(product);
        } catch (error) {
            throw error;
        }
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