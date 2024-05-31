const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2')
const { Schema } = mongoose;

const ticketSchema = new Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    purchase_datatime: {
        type: Date,  //created_at
        required: true
    },
    amount: {
        type: Number,  //$ total de la compra
        required: true
    },
    purchaser: {
        type: String, //email
        required: true
    }
});

ticketSchema.plugin(mongoosePaginate)
const Ticket = mongoose.model('Ticket', ticketSchema, 'tickets');
module.exports = Ticket;