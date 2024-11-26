const mongoose = require('mongoose');

class CartsService {

    constructor(storage){
        this.storage = storage
    }

    async getAll(){
        return this.storage.getAll()
    }

    async getById(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('invalid params');
        }
        return this.storage.getById(id);
    }

    async getProductById(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('invalid params');
        }
        return this.storage.getProductById(id);
    }

    
    async getTotalCart(cart) {
        let totalCart = 0;

        for (const cartItem of cart) {
            const productTotal = cartItem.quantity * cartItem.product.price;
            totalCart += productTotal;
        }

        return totalCart;
    }

    async deleteById(id){
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('invalid params');
        }
        return this.storage.deleteById(id)
    }

    async createOne({
        products: []
    }){        
        return this.storage.createOne({
            products: []
        })
    }

    async updateById(id){
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('invalid params');
        }
        return this.storage.updateById(id)
    }

    async updateOne(cart){
        return this.storage.updateOne(cart)
    }

    async clearCart(id){
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('invalid params');
        }
        return this.storage.clearCart(id);
    }
}

module.exports = { CartsService }