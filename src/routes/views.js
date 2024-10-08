const Router = require('./router')
const ViewController = require ('../controllers/view.controller')
const {userIsLoggedIn, userIsNotLoggedId, userIsAdmin, userIsNotAdmin} = require('../middlewares/auth.middleware')
const { ProductsService } = require('../services/productsService')
const { CartsService } = require('../services/cartsService')
const { SessionsService }= require('../services/sessionsService')
const { UsersService }= require('../services/usersService')
const { TicketsService }= require('../services/ticketsService')

class ViewRouter extends Router {
    init() {

        const withController = callback => {
            return (req, res) => {
                const productService = new ProductsService(
                    req.app.get('productsStorage')
                )
                const cartService = new CartsService(
                    req.app.get('cartsStorage')
                )
                const sessionService = new SessionsService(
                    req.app.get('sessionsStorage')
                )
                const userService = new UsersService(
                    req.app.get('usersStorage')
                )
                const ticketService = new TicketsService(
                    req.app.get('ticketsStorage')
                )
                const controller = new ViewController(productService, cartService, sessionService, userService, ticketService)
                return callback(controller, req, res)
            }
        }

        // Ruta para obtener todos los productos o filtrarlos
        this.get('/', withController((controller, req, res) => controller.getHome(req, res)));

        // Ruta para login
        this.get('/login', userIsNotLoggedId, withController((controller, req, res) => controller.getLogin(req, res)));

        // Ruta para resetear password
        this.get('/emailToSendResetPassword', userIsNotLoggedId, withController((controller, req, res) => controller.getEmailToSendResetPassword(req, res)));

        // Ruta para resetear password
        this.get('/resetPassword', userIsNotLoggedId, withController((controller, req, res) => controller.getResetPassword(req, res)));

        // Ruta para register
        this.get('/register', userIsNotLoggedId, withController((controller, req, res) => controller.getRegister(req,res)));

        // Ruta para profile
        this.get('/profile', userIsLoggedIn, withController((controller, req, res) => controller.getProfile(req, res)));

        // Ruta para obtener un producto por Id y renderizarlo
        this.get('/products/:pid', userIsLoggedIn, withController((controller, req, res) => controller.getRenderProduct(req, res)));

        // Ruta para obtener todos los productos o filtrados por parametros
        this.get('/products', userIsLoggedIn, withController((controller, req, res) => controller.getRenderProducts(req, res)));

        // Ruta para obtener cart por id
        this.get('/cart', userIsLoggedIn, userIsNotAdmin, withController((controller, req, res) => controller.getCartById(req, res)));

        // Ruta para acceder al form de datos del producto a agregar
        this.get('/productsManager', withController((controller, req, res) => controller.getProductsManager(req, res)));

        // Ruta para acceder al form de datos del producto a agregar
        this.get('/usersManager', userIsAdmin, withController((controller, req, res) => controller.getUsersManager(req, res)));

        // Nueva ruta para obtener un ticket por ID
        this.get('/ticket/:tid', userIsLoggedIn, withController((controller, req, res) => controller.getTicketById(req, res)));
    }
}

module.exports = ViewRouter