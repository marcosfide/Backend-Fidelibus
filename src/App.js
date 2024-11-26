const express = require('express');
const path = require('path');
const handlebars = require('express-handlebars').create({
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
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUiExpress = require('swagger-ui-express');
const { useLogger } = require('./utils/logger.js');
const initializeStrategy = require('./passport-config/passport-local.config.js');
const initializeGithubStrategy = require('./passport-config/passport-github.config.js');
const ProductsRouter = require('./routes/products.js');
const CartsRouter = require('./routes/carts.js');
const UsersRouter = require('./routes/users.js');
const SessionRouter = require('./routes/session.js');
const ChatRouter = require('./routes/chat.js');
const RealTimeProductsRouter = require('./routes/realTimeProducts.js');
const ViewRouter = require('./routes/views.js');
const TicketRouter = require('./routes/tickets.js');
const MockingProductsRouter = require('./routes/mockingProducts.js');
const LoggerTestRouter = require('./routes/logger.js');

const productsRouter = new ProductsRouter();
const cartsRouter = new CartsRouter();
const usersRouter = new UsersRouter();
const sessionRouter = new SessionRouter();
const chatRouter = new ChatRouter();
const realTimeProductsRouter = new RealTimeProductsRouter();
const viewsRouter = new ViewRouter();
const ticketsRouter = new TicketRouter();
const mockingProductsRouter = new MockingProductsRouter();
const loggerTestRouter = new LoggerTestRouter();

const ProductManager = require('./dao/dbManager/ProductManager');
const CartManager = require('./dao/dbManager/CartManager');
const ProductsStorage = require('./persistence/productsStorage.js');
const { dbName, mongoUrl } = require('./dbConfig.js');
const sessionMiddleware = require('./session/mongoStorage');
const CartsStorage = require('./persistence/cartsStorage.js');
const SessionsStorage = require('./persistence/sessionsStorage.js');
const UsersStorage = require('./persistence/usersStorage.js');
const TicketsStorage = require('./persistence/ticketsStorage.js');
const { errorHandler } = require('./services/errors/errorHandler.js');

const app = express();

const PORT = process.env.PORT || 8080

const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: "Ecommerce Fidelibus",
            version: "1.0.0",
            description: "API documentation for Ecommerce Fidelibus"
        },
    },
    apis: [`${__dirname}/docs/**/*.yaml`]
};

const specs = swaggerJSDoc(swaggerOptions);
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

// Configuración de Handlebars
app.engine('handlebars', handlebars.engine);
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

// Middleware y configuraciones
app.use(express.static(`${__dirname}/../public`));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(cookieParser());
app.use(sessionMiddleware);
app.use(useLogger);

app.use('/files', express.static(path.join(__dirname, '../files')));

initializeStrategy();
initializeGithubStrategy();
app.use(passport.initialize());
app.use(passport.session());

// Rutas principales
app.use('/api/products', productsRouter.getRouter());
app.use('/api/carts', cartsRouter.getRouter());
app.use('/api/tickets', ticketsRouter.getRouter());
app.use('/api/users', usersRouter.getRouter());
app.use('/api/session', sessionRouter.getRouter());
app.use('/', viewsRouter.getRouter());
app.use('/realTimeProducts', realTimeProductsRouter.getRouter());
app.use('/chat', chatRouter.getRouter());
app.use('/mockingproducts', mockingProductsRouter.getRouter());
app.use('/loggerTest', loggerTestRouter.getRouter());

// Error handler siempre después de las rutas
app.use(errorHandler);

// Inicialización de la base de datos y del servidor
const main = async () => {
    // Actualizamos la conexión a MongoDB Atlas
        await mongoose.connect(mongoUrl, { 
            dbName
            // Estas opciones ya no son necesarias:
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
        });

    const productManager = new ProductManager();
    const cartManager = new CartManager();

    app.set('productManager', productManager);
    app.set('cartManager', cartManager);
    app.set('productsStorage', new ProductsStorage());
    app.set('cartsStorage', new CartsStorage());
    app.set('sessionsStorage', new SessionsStorage());
    app.set('usersStorage', new UsersStorage());
    app.set('ticketsStorage', new TicketsStorage());

    const httpServer = app.listen(PORT, () => {
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

main().catch(error => console.error('Error al conectar a MongoDB:', error));
