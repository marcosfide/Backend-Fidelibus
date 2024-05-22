const Router = require('./router')
const ViewController = require ('../controllers/view.controller')

const User = require('../dao/models/user.model')
const {userIsLoggedIn, userIsNotLoggedId} = require('../middlewares/auth.middleware')

class ViewRouter extends Router {
    init() {

        // Ruta para obtener todos los productos o filtrarlos
        this.get('/', (req, res) => new ViewController().getHome(req, res));

        // Ruta para login
        this.get('/login', userIsNotLoggedId, (req, res) => new ViewController().getLogin(req, res));

        // Ruta para resetear password
        this.get('/resetPassword', userIsNotLoggedId, (req, res) => new ViewController().getResetPassword(req, res));

        // Ruta para register
        this.get('/register', userIsNotLoggedId, (req, res) => new ViewController().getRegister(req,res));

        // Ruta para profile
        this.get('/profile', userIsLoggedIn, async (req, res) => new ViewController().getProfile(req, res));

        // Ruta para obtener un producto por Id y renderizarlo
        this.get('/products/:pid', userIsLoggedIn, async (req, res) => new ViewController().getRenderProduct(req, res));

        // Ruta para obtener todos los productos o filtrados por parametros
        this.get('/products', userIsLoggedIn, async (req, res) => new ViewController().getRenderProducts(req, res));

        // Ruta para obtener cart por id
        this.get('/carts/:cid', userIsLoggedIn, async (req, res) => new ViewController().getCartById(req, res));

    }
}

module.exports = ViewRouter