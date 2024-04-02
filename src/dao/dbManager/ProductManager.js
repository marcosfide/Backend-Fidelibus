const ProductModel = require('../models/product.model');
const CartModel = require('../models/cart.model');

class ProductManager {

    constructor() {
    }
    
    async getProducts(){
        const products = await ProductModel.find()
        return products.map(p => p.toObject())
    }

    async addProduct({ title, description, code, price, status = true, stock, category, thumbnail = []}) {
        const requiredFields = title && description && code && price && stock && category;
        const textFields = typeof title === 'string' && typeof description === 'string' && typeof code === 'string' && typeof category === 'string';
        const numberFields = typeof price === 'number' && price > 0 && typeof stock === 'number' && stock >= 0;
        const statusField = typeof status === 'boolean';
        const validateFields = requiredFields && textFields && numberFields && statusField;
    
        if (!validateFields) {
            console.log('Faltan campos obligatorios o algunos campos no tienen el formato correcto');
            return;
        }
    
        try {
            await ProductModel.create({
                title,
                description,
                code,
                price,
                status,
                stock,
                category,
                thumbnail: thumbnail
            })
    
            return
    
        } catch (error) {
            console.error('Error al agregar el producto:', error);
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




    async addCart() {
        try {
    
            CartModel.create({
                products: []
            })
    
            return;
    
        } catch (error) {
            console.error('Error al agregar el carrito:', error);
        }
    }    


    async getCartById(id) {

        try {
            const cart = await CartModel.findById({ _id: id })
            console.log(cart);
            if (cart) { 
                return cart
            } else{
                console.error('Not found');
                return null
            }            
        }  catch (error) {
            console.error('Error al buscar el carrito', error);
            throw error
        }
    }

    async updateCart(cartId, updatedCart) {
        try {
            // Buscar el carrito por su ID
            const cart = await CartModel.findById(cartId);
            
            // Verificar si el carrito existe
            if (!cart) {
                console.error('Carrito no encontrado');
                return null;
            }
            
            // Actualizar el carrito con los datos proporcionados
            cart.products = updatedCart.products;
            
            // Guardar el carrito actualizado en la base de datos
            const savedCart = await cart.save();
    
            return savedCart;
        } catch (error) {
            console.error('Error al actualizar el carrito:', error);
            throw error;
        }
    }
    
    

}

module.exports = ProductManager;
