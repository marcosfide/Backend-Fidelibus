const Router = require('./router')
const ViewController = require ('../controllers/view.controller')

const User = require('../dao/models/user.model')
const {userIsLoggedIn, userIsNotLoggedId} = require('../middlewares/auth.middleware')
const { ProductsService } = require('../services/productsService')
const { CartsService } = require('../services/cartsService')

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
                const controller = new ViewController(productService, cartService)
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
        this.get('/carts/:cid', userIsLoggedIn, withController((controller, req, res) => controller.getCartById(req, res)));

    }
}

module.exports = ViewRouter