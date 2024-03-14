const express = require('express');
const handlebars = require('express-handlebars');
const { Server } = require('socket.io')


const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');
const viewsRouter = require('./routes/views.router');
const realTimeProductsRouter = require('./routes/realTimeProducts.router')


const app = express();


const methodOverride = require('method-override');

// Configuración de Handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');


app.use(express.static(`${__dirname}/../public`));

// Permitir envío de información mediante formularios y JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(methodOverride('_method'));

// Routers
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);
app.use('/realTimeProducts', realTimeProductsRouter);

const httpServer = app.listen(8080, () => {
    console.log('Servidor listo');
});


const wsServer = new Server(httpServer);
app.set('ws', wsServer)

wsServer.on('connection', (socket) => {
    console.log('Nuevo cliente conectado a WebSocket');
})