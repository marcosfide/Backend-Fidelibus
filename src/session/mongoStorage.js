const MongoStore = require('connect-mongo');
const session = require('express-session');
const dafaultOptions = require('./dafaultOptions');

const {dbName, mongoUrl} = require('../dbConfig')

const storage = MongoStore.create({
    dbName,
    mongoUrl,
    ttl: 600
})

module.exports = session({
    store: storage,
    ...dafaultOptions
})