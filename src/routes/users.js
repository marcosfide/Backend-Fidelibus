const Router = require('./router')
const passport = require('passport');
const UserController = require('../controllers/user.controller');
const { UsersService }= require('../services/usersService')

class UserRouter extends Router {
    init() {

        const withController = callback => {
            return (req, res) => {
                const service = new UsersService(
                    req.app.get('usersStorage')
                )
                const controller = new UserController(service)
                return callback(controller, req, res)
            }
        }
        
        this.post('/register', passport.authenticate('register', {failureRedirect: '/api/session/failregister'}), withController((controller, req, res) => controller.register(req, res)));
        
        this.post('/resetPassword', withController((controller, req, res) => controller.resetPassword(req, res)));
        
    }
}

module.exports = UserRouter