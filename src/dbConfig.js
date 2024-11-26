// dbConfig.js
require('dotenv').config();

module.exports = {
  dbName: process.env.DB_NAME,
  mongoUrl: `mongodb+srv://${process.env.MONGO_ATLAS_USER}:${process.env.MONGO_ATLAS_PASS}@cluster0.sualiod.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`
};
