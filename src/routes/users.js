const Router = require('./router')
const passport = require('passport');
const UserController = require('../controllers/user.controller');
const { UsersService }= require('../services/usersService')
const { ProductsService } = require('../services/productsService')
const { CartsService } = require('../services/cartsService')
const {userIsNotAdmin, userIsAdmin} = require('../middlewares/auth.middleware')
const uploader = require('../middlewares/uploadFile');

class UserRouter extends Router {
    init() {

        const withController = callback => {
            return (req, res) => {
                const userService = new UsersService(
                    req.app.get('usersStorage'),
                    req.app.get('productsStorage'),
                    req.app.get('cartsStorage')
                )
                const productService = new ProductsService(
                    req.app.get('productsStorage')
                )
                const cartService = new CartsService(
                    req.app.get('cartsStorage')
                )
                const controller = new UserController(userService, productService, cartService)
                return callback(controller, req, res)
            }
        }
        
        this.get('/', userIsAdmin, withController((controller, req, res) => controller.getUsers(req, res)));
        
        this.post('/register', passport.authenticate('register', {failureRedirect: '/api/session/failregister'}), withController((controller, req, res) => controller.register(req, res)));
        
        this.post('/resetPassword', withController((controller, req, res) => controller.resetPassword(req, res)));

        this.post('/sendEmailToResetPassword', withController((controller, req, res) => controller.sendEmailToResetPassword(req, res)));

        this.post('/premium/:uid', userIsNotAdmin, withController((controller, req, res) => controller.changeRol(req, res)));

        this.post('/:uid/documents', uploader.single('image'), withController((controller, req, res) => controller.addImage(req, res)));

        this.delete('/', userIsAdmin, withController((controller, req, res) => controller.deleteInactiveUsers(req, res)));
        
        this.delete('/:uid', userIsAdmin, withController((controller, req, res, next) => controller.deleteUserById(req, res, next)));
    }
}

module.exports = UserRouter