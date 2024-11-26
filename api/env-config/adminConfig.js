const dotenv = require('dotenv')

dotenv.config()

module.exports = {
    emailAdmin: process.env.ADMIN_EMAIL,
    passwordAdmin: process.env.ADMIN_PASSWORD,
    emailSuperAdmin: process.env.SUPERADMIN_EMAIL,
    passwordSuperAdmin: process.env.SUPERADMIN_PASSWORD
}