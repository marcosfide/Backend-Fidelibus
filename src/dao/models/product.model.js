const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2')
const { Schema } = mongoose;

const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
});

productSchema.plugin(mongoosePaginate)
const Product = mongoose.model('Product', productSchema, 'products');
module.exports = Product;