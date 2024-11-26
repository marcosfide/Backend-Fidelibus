const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    _id: String,
    expires: Date,
    session: String
});

module.exports = mongoose.model('Session', sessionSchema, 'sessions');
