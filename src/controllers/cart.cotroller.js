const CartModel = require('../dao/models/cart.model');
const mongoose = require('mongoose');

class CartController {
    
    constructor(cartService, userService){
        this.cartService = cartService
        this.userService = userService
    }

    #handleError(res, err) {
        if (err.message === 'not found') {
            return res.status(404).json({ error: 'Cart not found' });
        }
        if (err.message === 'invalid params') {
            return res.status(400).json({ error: 'Invalid params' });
        }
        return res.status(500).json({ error: err.message });
    }

    async getCarts(req, res) {
        try {
            const carts = await this.cartService.getAll()
            res.status(200).json(carts);
        } catch (error) {
            res.status(500).json({ error: 'Error al buscar los carts' });
        }
    }

    async getCartById(req, res) {
        try {
            const cartId = req.params.cid
            const cart = await this.cartService.getById(cartId)
            if (cart) { 
                res.status(200).json(cart);
            } else{
                res.status(400).json({ error: 'cart no encontrado.' });
            }
        } catch (error) {
            return this.#handleError(res, error);
        }
    }

    async addCart(req, res) {
        try {
            await this.cartService.createOne({
                products: []
            })
            res.status(201).json({status: 'success', message:'Se ha creado un nuevo carrito'})
        } catch (error) {
            return this.#handleError(res, error);
        }
    }

    async addProductToCart(req, res) {
        try {
            const cartId = req.params.cid;
            const productId = req.params.pid;
            
            const cart = await this.cartService.getById(cartId);
            const product = await this.cartService.getProductById(productId);
    
            // Verificar si el carrito y el producto existen
            if (!cart) {
                throw new Error('Carrito no encontrado.');
            }
            if (!product) {
                throw new Error('Producto no encontrado.');
            }

            // Verificar si el producto ya está en el carrito
            const existingProduct = cart.products.find(item => item.product && item.product._id.toString() === productId);
            if (existingProduct) {
                // Si el producto ya está en el carrito, incrementar la cantidad
                existingProduct.quantity++;
            } else {
                // Si el producto no está en el carrito, agregarlo al arreglo "products" del carrito
                cart.products.push({ product: productId, quantity: 1 });
            }
    
            // Guardar el carrito actualizado en la base de datos
            const savedCart = await cart.save();

            res.status(200).json({ status: 'success', message: 'Producto agregado al carrito correctamente.' });
    
            return savedCart;
        } catch (error) {
            return this.#handleError(res, error);
        }
    }

    async addProductToCartView(req, res) {
        try {
            const user = await this.userService.getById(req.session.user._id)
            const cartId = user.cart;
            const productId = req.params.pid;
            const quantity = parseInt(req.body.quantity)
            
            const cart = await this.cartService.getById(cartId);
            const product = await this.cartService.getProductById(productId);
    
            // Verificar si el carrito y el producto existen
            if (!cart) {
                throw new Error('Carrito no encontrado.');
            }
            if (!product) {
                throw new Error('Producto no encontrado.');
            }
            if(product.owner === req.session.user.email){
                throw new Error('No puedes agregar al carrito un producto que te pertenece');
            }

            // Verificar si el producto ya está en el carrito
            const existingProduct = cart.products.find(item => item.product && item.product._id.toString() === productId);
            if (existingProduct) {
                // Si el producto ya está en el carrito, incrementar la cantidad
                existingProduct.quantity = existingProduct.quantity + quantity;
            } else {
                // Si el producto no está en el carrito, agregarlo al arreglo "products" del carrito
                cart.products.push({ product: productId, quantity: quantity, _id: productId });
            }
    
            // Guardar el carrito actualizado en la base de datos
            const savedCart = await cart.save();

            res.redirect('/cart');
    
            return savedCart;
        } catch (error) {
            return this.#handleError(res, error);
        }
    }

    async deleteProductFromCart(req, res) {
        try {
            const cartId = req.params.cid;
            const productId = req.params.pid;
    
            // Encuentra el carrito por su ID
            const cart = await this.cartService.getById(cartId);
    
            if (!cart) {
                return res.status(404).json({ error: 'Carrito no encontrado.' });
            }
    
            // Encuentra el índice del producto en el array de productos
            const productIndex = cart.products.findIndex(item => item.product && item.product._id.toString() === productId);
    
            if (productIndex === -1) {
                return res.status(404).json({ error: 'Producto no encontrado en el carrito.' });
            }
    
            // Elimina el producto del array de productos
            cart.products.splice(productIndex, 1);
    
            // Guarda el carrito actualizado
            await cart.save();
            res.status(200).json({ status: 'success', message: 'Producto eliminado del carrito correctamente.' });
        } catch (error) {
            return this.#handleError(res, error);
        }
    }

    async deleteProductFromCartView(req, res) {
        try {
            const user = await this.userService.getById(req.session.user._id)
            const cartId = user.cart;
            const productId = req.params.pid;
            console.log('prodID',productId);
    
            // Encuentra el carrito por su ID
            const cart = await this.cartService.getById(cartId);
    
            if (!cart) {
                return res.status(404).json({ error: 'Carrito no encontrado.' });
            }
    
            // Encuentra el índice del producto en el array de productos
            const productIndex = cart.products.findIndex(item => item.product && item.product._id.toString() === productId);
    
            if (productIndex === -1) {
                return res.status(404).json({ error: 'Producto no encontrado en el carrito.' });
            }
    
            // Elimina el producto del array de productos
            cart.products.splice(productIndex, 1);
    
            // Guarda el carrito actualizado
            await cart.save();
            res.redirect('/cart');
        } catch (error) {
            return this.#handleError(res, error);
        }
    }

    async updateCartProducts(req, res) {
        try {
            const cartId = req.params.cid
            const updatedProducts = req.body
            // Buscar el carrito por su ID
            const cart = await this.cartService.getById(cartId);
            
            // Verificar si el carrito existe
            if (!cart) {
                console.error('Carrito no encontrado');
                throw new Error('Carrito no encontrado');
            }
            
            // Actualizar el carrito con los datos proporcionados
            cart.products = updatedProducts;
            
            // Guardar el carrito actualizado en la base de datos
            const savedCart = await cart.save();
    
            res.status(200).json({ status: 'success', message: 'Carrito actualizado correctamente.' });
            return savedCart;
        } catch (error) {
            return this.#handleError(res, error);
        }
    }

    async updateQuantityCartProduct(req, res){
        try {
            const cartId = req.params.cid;
            const productId = req.params.pid;
            const quantityProduct = req.body.quantity

            // Buscar el carrito por su ID
            const cart = await this.cartService.getById(cartId);
            // Verificar si el carrito existe
            if (!cart) {
                console.error('Carrito no encontrado');
                throw new Error('Carrito no encontrado');
            }
        
            // Encuentra el índice del producto en el array de productos
            const productIndex = cart.products.findIndex(item => item.product && item.product._id.toString() === productId);
    
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
    
            res.status(200).json({ status: 'success', message: 'Carrito actualizado correctamente.' });
            return savedCart;
        } catch (error) {
            return this.#handleError(res, error);
        }
    }

    async clearCart(req, res) {
        try {
            const cartId = req.params.cid
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
    
            res.status(200).json({ status: 'success', message: 'Productos elimnados del cart '+cartId });
            return savedCart;
        } catch (error) {
            return this.#handleError(res, error);
        }
    }
    
}


module.exports = CartController