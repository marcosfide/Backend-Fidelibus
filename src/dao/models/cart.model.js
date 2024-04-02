const mongoose = require('mongoose');
const { Schema } = mongoose;

const cartSchema = new Schema({
    products: [{
        quantity: {
            type: Number,
            required: true,
            default: 1
        }
    }]
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
