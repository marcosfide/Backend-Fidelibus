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


const initializeStrategy = require('./passport-config/passport-local.config.js');
const initializeGithubStrategy = require('./passport-config/passport-github.config.js');

const ProductsRouter = require('./routes/products.js');
const CartsRouter = require('./routes/carts.js');
const UsersRouter = require('./routes/users.js');
const SessionRouter = require('./routes/session.js');
const ChatRouter = require('./routes/chat.js');
const RealTimeProductsRouter = require('./routes/realTimeProducts.js')
const ViewRouter = require('./routes/views.js')
const TicketRouter = require('./routes/tickets.js')


const productsRouter = new ProductsRouter()
const cartsRouter = new CartsRouter()
const usersRouter = new UsersRouter()
const sessionRouter = new SessionRouter()
const chatRouter = new ChatRouter()
const realTimeProductsRouter = new RealTimeProductsRouter()
const viewsRouter = new ViewRouter()
const ticketsRouter = new TicketRouter()

const ProductManager = require('./dao/dbManager/ProductManager');
const CartManager = require('./dao/dbManager/CartManager');
const ProductsStorage = require('./persistence/productsStorage.js');


const {dbName, mongoUrl} = require('./dbConfig.js');
// const sessionMiddleware = require('./session/memoryStorage');
// const sessionMiddleware = require('./session/fileStorage');
const sessionMiddleware = require('./session/mongoStorage');
const CartsStorage = require('./persistence/cartsStorage.js');
const SessionsStorage = require('./persistence/sessionsStorage.js');
const UsersStorage = require('./persistence/usersStorage.js');
const TicketsStorage = require('./persistence/ticketsStorage.js');



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

// Rutas principales
app.use('/api/products', productsRouter.getRouter());
app.use('/api/carts', cartsRouter.getRouter());
app.use('/api/tickets', ticketsRouter.getRouter());
app.use('/api/users', usersRouter.getRouter());
app.use('/api/session', sessionRouter.getRouter());
app.use('/', viewsRouter.getRouter());
app.use('/realTimeProducts', realTimeProductsRouter.getRouter());
app.use('/chat', chatRouter.getRouter());

// Inicialización de la base de datos y del servidor
const main = async () => {
    await mongoose.connect(mongoUrl, {dbName});

    const productManager = new ProductManager();
    const cartManager = new CartManager();

    app.set('productManager', productManager);
    app.set('cartManager', cartManager);
    app.set('productsStorage', new ProductsStorage())
    app.set('cartsStorage', new CartsStorage())
    app.set('sessionsStorage', new SessionsStorage())
    app.set('usersStorage', new UsersStorage())
    app.set('ticketsStorage', new TicketsStorage())

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
