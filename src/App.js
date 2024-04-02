const express = require('express');
const handlebars = require('express-handlebars');
const { Server } = require('socket.io')
const mongoose = require('mongoose')


const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');
const viewsRouter = require('./routes/views.router');
const realTimeProductsRouter = require('./routes/realTimeProducts.router');
const chatRouter = require('./routes/chat.router');


const app = express();


const methodOverride = require('method-override');
const ProductManager = require('./dao/dbManager/ProductManager');

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
app.use('/chat', chatRouter);



const main = async () => {
    await mongoose.connect('mongodb://localhost:27017', {
        dbName: 'ecommerce'
    });
    
    const productManager = new ProductManager()

    app.set('productManager', productManager)

    const httpServer = app.listen(8080, () => {
        console.log('Servidor listo');
    });

    const io = new Server(httpServer);

    const messageHistory = []

    io.on('connection', (clientSocket) => {
        console.log('Nuevo cliente conectado => ', clientSocket.id);

        // enviarle al usuario que se conecta todos los mensajes hasta el momento
        for (const data of messageHistory){
            clientSocket.emit('message', data)
        }


        clientSocket.on('message', (data) => {
            messageHistory.push(data)

            io.emit('message', data)
        })

        clientSocket.on('user-connected', (username) =>{
            // notificar a los otros usuarios que se conectó
            clientSocket.broadcast.emit('user-joined-chat', username)
        })
    })

}

main()