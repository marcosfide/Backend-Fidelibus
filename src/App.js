const express = require('express');
const handlebars = require('express-handlebars').create({
    // Opciones para controlar el acceso al prototipo
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    }
});
const { Server } = require('socket.io');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const passport = require('passport');


const initializeStrategy = require('./config/passport-local.config.js');
const initializeGithubStrategy = require('./config/passport-github.config.js');

const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');
const viewsRouter = require('./routes/views.router');
const realTimeProductsRouter = require('./routes/realTimeProducts.router');
const managerDBProductsViewRouter = require('./routes/managerDBProductsView.router');
const chatRouter = require('./routes/chat.router');

const ProductManager = require('./dao/dbManager/ProductManager');
const CartManager = require('./dao/dbManager/CartManager');


const {dbName, mongoUrl} = require('./dbConfig.js');
// const sessionMiddleware = require('./session/memoryStorage');
// const sessionMiddleware = require('./session/fileStorage');
const sessionMiddleware = require('./session/mongoStorage');



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

app.use(cookieParser())
app.use(sessionMiddleware)

initializeStrategy()
initializeGithubStrategy()
app.use(passport.initialize())
app.use(passport.session())

// Rutas y middleware de sesión
app.use('/api/session', require('./routes/session.router'));

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
    await mongoose.connect(mongoUrl, {dbName});

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
