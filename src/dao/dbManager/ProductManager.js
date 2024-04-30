const ProductModel = require('../models/product.model');

class ProductManager {

    constructor() {
    }
    
    async getProducts(data){
        try {
            let { limit, page, sort, category, availability } = data;
            limit = limit ? limit : 10;
            page = page ? page : 1;
            const query = {};
                
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
    
            const products = await ProductModel.paginate(query, options);

            // Validar si page no está definido o es menor que 1
            if (isNaN(page) || page < 1 || page > products.totalPages) {
                throw new Error('¡Página no válida!');
            }

            return products;
        } catch (err) {
            throw err;
        }
    }
    
    // Función para construir el enlace previo
    async buildPrevLink (baseUrl, queryParams, currentPage){
        const prevPage = currentPage - 1;
        if (prevPage >= 1) {
            queryParams.page = prevPage; // Modificar el parámetro de consulta page
            return `${baseUrl}?${new URLSearchParams(queryParams)}`;
        } else {
            return null; // No hay página anterior
        }
    };
    // Función para construir el enlace siguiente
    async buildNextLink(baseUrl, queryParams, currentPage, totalPages){
        const nextPage = currentPage + 1;
        if (nextPage <= totalPages) {
            queryParams.page = nextPage; // Modificar el parámetro de consulta page
            return `${baseUrl}?${new URLSearchParams(queryParams)}`;
        } else {
            return null; // No hay página siguiente
        }
    };

    async addProduct({ title, description, code, price, status = true, stock, category, thumbnail = []}) {
        // Verificar si el código del producto ya existe en la base de datos
        const existingProduct = await ProductModel.findOne({ code: code });

        if (existingProduct) {
            return { error: `El código de producto ${code} ya se encuentra en la base de datos` };
        }

        // Validar los campos del producto
        const requiredFields = title && description && code && price && stock && category;
        price = +price;
        stock = +stock;
        status = (status === 'true');
        const textFields = typeof title === 'string' && typeof description === 'string' && typeof code === 'string' && typeof category === 'string';
        const numberFields = typeof price === 'number' && price > 0 && typeof stock === 'number' && stock >= 0;
        const statusField = typeof status === 'boolean';
        console.log(status, statusField);

        if (!requiredFields || !textFields || !numberFields || !statusField) {
            return { error: "Los campos del producto no son válidos" };
        }

        try {
            // Crear el nuevo producto en la base de datos
            await ProductModel.create({
                title,
                description,
                code,
                price,
                status,
                stock,
                category,
                thumbnail: thumbnail
            });

            return { success: true };
        } catch (error) {
            console.error('Error al agregar el producto:', error);
            return { error: 'Error al agregar el producto' };
        }
    }

    async getProductById(id) {
        try {
            const product = await ProductModel.findById(id);
            if (product) { 
                return product;
            } else {
                console.error('Producto no encontrado');
                return null;
            }
        } catch (error) {
            console.error('Error al buscar el producto:', error);
            return null;
        }
    }    

    async updateProduct(id, updatedFields) {
        try {
            // Buscar el producto por su ID
            const product = await ProductModel.findById(id);
            
            // Verificar si el producto existe
            if (!product) {
                console.error('Producto no encontrado');
                return null;
            }
    
            // Validar los campos actualizados
            if (updatedFields.title && typeof updatedFields.title !== 'string') {
                throw new Error("El campo title debe ser un string.");
            }
            if (updatedFields.description && typeof updatedFields.description !== 'string') {
                throw new Error("El campo description debe ser un string.");
            }
            if (updatedFields.code && typeof updatedFields.code !== 'string') {
                throw new Error("El campo code debe ser un string.");
            }
            if (updatedFields.category && typeof updatedFields.category !== 'string') {
                throw new Error("El campo category debe ser un string.");
            }
            if (updatedFields.price && typeof updatedFields.price !== 'number') {
                throw new Error("El campo price debe ser un number.");
            }
            if (updatedFields.stock && typeof updatedFields.stock !== 'number') {
                throw new Error("El campo stock debe ser un number.");
            }
            if (updatedFields.status && typeof updatedFields.status !== 'boolean') {
                throw new Error("El campo status debe ser un boolean.");
            }
            
            // Actualizar el producto con los datos proporcionados
            Object.assign(product, updatedFields);
            
            // Guardar el producto actualizado en la base de datos
            const updatedProduct = await product.save();
    
            return updatedProduct;
        } catch (error) {
            console.error('Error al intentar actualizar el producto:', error);
            throw error;
        }
    }
    
    
    
    async deleteProductById(id) {
        await ProductModel.deleteOne({ _id: id })
    }

}

module.exports = ProductManager;
