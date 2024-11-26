const mongoose = require('mongoose');
const { Schema } = mongoose;

const cartSchema = new Schema({
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product' // debe coincidir con el nombre del modelo
        },
        quantity: {
            type: Number,
            required: true,
            default: 1
        }
    }]
});

cartSchema.pre('find', function(next) {
    this.populate('products.product');
    next();
});


const Cart = mongoose.model('Cart', cartSchema, 'carts');

module.exports = Cart;
