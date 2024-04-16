const ProductModel = require('../models/product.model');
const CartModel = require('../models/cart.model');
const mongoose = require('mongoose');

class CartManager {

    constructor() {
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

    async getCarts() {

        try {
            const carts = await CartModel.find()
                return carts
        }  catch (error) {
            console.error('Error al buscar la collection carts', error);
            throw error
        }
    }

    async getCartById(id) {

        try {
            const cart = await CartModel.findOne({ _id: id }).populate('products.product')
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

    async updateCartProducts(cartId, updatedProducts) {
        try {
            // Validar id
            if (!mongoose.Types.ObjectId.isValid(cartId)) {
                throw new Error('El ID del carrito no es válido');
            }
            // Buscar el carrito por su ID
            const cart = await CartModel.findById(cartId);
            
            // Verificar si el carrito existe
            if (!cart) {
                console.error('Carrito no encontrado');
                throw new Error('Carrito no encontrado');
            }
            
            // Actualizar el carrito con los datos proporcionados
            cart.products = updatedProducts;
            
            // Guardar el carrito actualizado en la base de datos
            const savedCart = await cart.save();
    
            return savedCart;
        } catch (error) {
            console.error('Error al actualizar el carrito:', error);
            throw error;
        }
    }

    async updateQuantityCartProduct(cartId, productId, quantityProduct){
        try {
            // Validar cartId
            if (!mongoose.Types.ObjectId.isValid(cartId)) {
                throw new Error('El ID del carrito no es válido');
            }
            // Validar productId
            if (!mongoose.Types.ObjectId.isValid(productId)) {
                throw new Error('El ID del producto no es válido');
            }

            // Buscar el carrito por su ID
            const cart = await CartModel.findById(cartId);
            // Verificar si el carrito existe
            if (!cart) {
                console.error('Carrito no encontrado');
                throw new Error('Carrito no encontrado');
            }
        
            // Buscar el índice del producto en el arreglo de productos del carrito
            const productIndex = cart.products.findIndex(product => product._id.toString() === productId);
            
            // Verificar si el producto está en el carrito
            if (productIndex !== -1) {
                // Actualizar la cantidad del producto
                cart.products[productIndex].quantity = quantityProduct;
            } else {
                console.error('Producto no encontrado en el carrito');
                throw new Error('Producto no encontrado en el carrito');
            }
    
            // Guardar el carrito actualizado en la base de datos
            const savedCart = await cart.save();
    
            return savedCart;
        } catch (error) {
            console.error('Error al actualizar el carrito:', error);
            throw error;
        }
    }

    async addProductToCart(cartId, productId) {
        try {
            // Obtener el carrito y el producto correspondientes a los IDs proporcionados
            const cart = await CartModel.findById(cartId);
            const product = await ProductModel.findById(productId);
    
            // Verificar si el carrito y el producto existen
            if (!cart) {
                throw new Error('Carrito no encontrado.');
            }
            if (!product) {
                throw new Error('Producto no encontrado.');
            }
    
            // Verificar si el producto ya está en el carrito
            const existingProduct = cart.products.find(item => item.product && item.product.toString() === productId);
            if (existingProduct) {
                // Si el producto ya está en el carrito, incrementar la cantidad
                existingProduct.quantity++;
            } else {
                // Si el producto no está en el carrito, agregarlo al arreglo "products" del carrito
                cart.products.push({ product: productId, quantity: 1 });
            }
    
            // Guardar el carrito actualizado en la base de datos
            const savedCart = await cart.save();
    
            return savedCart;
        } catch (error) {
            console.error('Error al agregar el producto al carrito:', error);
            throw error; // Lanzar el error para que sea manejado por el controlador de la ruta
        }
    }
    
    
   
    async deleteProductFromCart(params) {
        const cartId = params.cid;
        const productId = params.pid;
    
        try {
            // Encuentra el carrito por su ID
            const cart = await CartModel.findById(cartId);
    
            if (!cart) {
                return res.status(404).json({ error: 'Carrito no encontrado.' });
            }
    
            // Encuentra el índice del producto en el array de productos
            const productIndex = cart.products.findIndex(product => product._id == productId);
    
            if (productIndex === -1) {
                return res.status(404).json({ error: 'Producto no encontrado en el carrito.' });
            }
    
            // Elimina el producto del array de productos
            cart.products.splice(productIndex, 1);
    
            // Guarda el carrito actualizado
            await cart.save();

        } catch (error) {
            console.error('Error al eliminar el producto del carrito:', error);
        }
    }

    async clearCart(cartId) {
        try {
            // Verificar si cartId es un ObjectId válido de Mongoose
            if (!mongoose.Types.ObjectId.isValid(cartId)) {
                throw new Error('El ID del carrito no es válido');
            }
    
            // Buscar el carrito por su ID
            const cart = await CartModel.findById(cartId);
    
            // Verificar si el carrito existe
            if (!cart) {
                console.error('Carrito no encontrado');
                throw new Error('Carrito no encontrado');
            }
    
            // Establecer el arreglo products como vacío
            cart.products = [];
    
            // Guardar el carrito actualizado en la base de datos
            const savedCart = await cart.save();
    
            return savedCart;
        } catch (error) {
            console.error('Error al limpiar el carrito:', error);
            throw error;
        }
    }
    


}

module.exports = CartManager;
