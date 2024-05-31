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

    async getTotalCart(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('invalid params');
        }
        const cart = await this.storage.getById(id);

        const totalCart = cart.products.reduce((total, cartItem) => {
            return total + (cartItem.product.price * cartItem.quantity);
        }, 0);

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
}

module.exports = { CartsService }