const CartModel = require('../dao/models/cart.model')
const ProductModel = require('../dao/models/product.model');

class CartsStorage {

    constructor(){}

    async getAll(){
        return await CartModel.find();
    }

    async getById(id){
        const cart = await CartModel.findOne({ _id: id }).populate('products.product')
        if(!cart){
            throw new Error('not found')
        }
        return cart
    }

    async getProductById(id){
        const product = await ProductModel.findById(id)
        if(!product){
            throw new Error('not found')
        }
        return product
    }

    async createOne({
        products: []
    }){
        return await CartModel.create({
            products: []
        })
    }

    async deleteById(id){
        const cart = await CartModel.findById(id)
        if(!cart){
            throw new Error('not found')
        }
        await CartModel.deleteOne({ _id: id })

        return (cart, ' deleted')
    }

    async clearCart(id){
        const cart = await CartModel.findById(id);
        if (!cart) {
            throw new Error('not found');
        }
        cart.products = [];
        await cart.save();
        return cart;
    }

    async updateOne(cart){
        const { _id, ...updateData } = cart;
        const updatedCart = await CartModel.findByIdAndUpdate(_id, updateData, { new: true, runValidators: true });
        if (!updatedCart) {
            throw new Error('Cart no encontrado');
        }
        return updatedCart;
    }
}

module.exports = CartsStorage