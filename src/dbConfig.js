const dotenv = require('dotenv')

dotenv.config()

module.exports = {
    dbName: process.env.DB_NAME,
    mongoUrl: process.env.MONGO_URL
}
