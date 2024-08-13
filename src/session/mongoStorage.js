// mongoStorage.js
require('dotenv').config();

const MongoStore = require('connect-mongo');
const session = require('express-session');
const dafaultOptions = require('./dafaultOptions'); // Asegúrate de que este archivo exista

const { dbName, mongoUrl } = require('../dbConfig'); // Verifica las importaciones

console.log('MongoDB URL:', mongoUrl);
console.log('Database Name:', dbName);

const storage = MongoStore.create({
  mongoUrl,
  ttl: 600,
  autoRemove: 'native',
});

module.exports = session({
  store: storage,
  secret: 'tuSecreto', // Define un secreto seguro
  resave: false,
  saveUninitialized: true,
  ...dafaultOptions
});