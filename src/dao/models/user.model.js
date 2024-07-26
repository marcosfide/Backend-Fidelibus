const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    age: Number,
    email: {
        type: String,
        unique: true
    },
    password: String,
    rol: {
        type: String,
        default: 'User'
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart'
    },
    documents: [{
        name: {
            type: String,
            required: true
        },
        reference: {
            type: String,
            required: true
        }
    }],
    last_connection: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('User', schema, 'users')