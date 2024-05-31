const Router = require('./router')
const ViewController = require ('../controllers/view.controller')
const {userIsLoggedIn, userIsNotLoggedId, userIsAdmin} = require('../middlewares/auth.middleware')
const { ProductsService } = require('../services/productsService')
const { CartsService } = require('../services/cartsService')
const { SessionsService }= require('../services/sessionsService')
const { UsersService }= require('../services/usersService')

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
                const controller = new ViewController(productService, cartService, sessionService, userService)
                return callback(controller, req, res)
            }
        }

        // Ruta para obtener todos los productos o filtrarlos
        this.get('/', withController((controller, req, res) => controller.getHome(req, res)));

        // Ruta para login
        this.get('/login', userIsNotLoggedId, withController((controller, req, res) => controller.getLogin(req, res)));

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
        this.get('/cart', userIsLoggedIn, withController((controller, req, res) => controller.getCartById(req, res)));


        // Ruta para acceder al form de datos del producto a agregar
        this.get('/productsManager', userIsAdmin, withController((controller, req, res) => controller.getProductsManager(req, res)));

    }
}

module.exports = ViewRouter