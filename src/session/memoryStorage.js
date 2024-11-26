const session = require('express-session')
const defaultOptions = require('./dafaultOptions')

module.exports = session({
    ...defaultOptions
})