const express = require('express');
const handlebars = require('express-handlebars').create({
    // Opciones para controlar el acceso al prototipo
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    }
});
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const session = require('express-session');

const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');
const viewsRouter = require('./routes/views.router');
const realTimeProductsRouter = require('./routes/realTimeProducts.router');
const managerDBProductsViewRouter = require('./routes/managerDBProductsView.router');
const chatRouter = require('./routes/chat.router');

const methodOverride = require('method-override');
const ProductManager = require('./dao/dbManager/ProductManager');
const CartManager = require('./dao/dbManager/CartManager');

const app = express();

// Configuración de Handlebars con opciones para controlar el acceso al prototipo
app.engine('handlebars', handlebars.engine);
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

// Middleware y configuraciones
app.use(express.static(`${__dirname}/../public`));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Configuración de express-session
app.use(session({
    secret: 'asdf12423bre',
    resave: true,
    saveUninitialized: true
}));

// Rutas y middleware de sesión
app.use('/session', require('./routes/session.router.js'));

const authMiddleware = (req, res, next) => {
    // Middleware para verificar sesión de administrador
    if (!req.session.admin) {
        return res.status(401).send('Unauthorized!')
    }
    next()
}

app.get('/admin', authMiddleware, (req, res) => {
    res.send('Admin page')
})

// Rutas principales
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);
app.use('/realTimeProducts', realTimeProductsRouter);
app.use('/managerDBProductsView', managerDBProductsViewRouter);
app.use('/chat', chatRouter);

// Inicialización de la base de datos y del servidor
const main = async () => {
    await mongoose.connect('mongodb://localhost:27017', {
        dbName: 'ecommerce'
    });

    const productManager = new ProductManager();
    const cartManager = new CartManager();

    app.set('productManager', productManager);
    app.set('cartManager', cartManager);

    const httpServer = app.listen(8080, () => {
        console.log('Servidor listo');
    });

    const io = new Server(httpServer);
    app.set('ws', io);

    const messageHistory = [];

    io.on('connection', (clientSocket) => {
        console.log('Nuevo cliente conectado => ', clientSocket.id);

        for (const data of messageHistory) {
            clientSocket.emit('message', data);
        }

        clientSocket.on('message', (data) => {
            messageHistory.push(data);
            io.emit('message', data);
        });

        clientSocket.on('user-connected', (username) => {
            clientSocket.broadcast.emit('user-joined-chat', username);
        });
    });
};

main();
