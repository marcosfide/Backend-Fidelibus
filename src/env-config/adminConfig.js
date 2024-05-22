const dotenv = require('dotenv')

dotenv.config()

module.exports = {
    emailAdmin: process.env.ADMIN_EMAIL,
    passwordAdmin: process.env.ADMIN_PASSWORD
}