const dotenv = require('dotenv')

dotenv.config()

module.exports = {
    appId: process.env.APP_ID,
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
}