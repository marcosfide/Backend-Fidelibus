const Router = require('./router')
const passport = require('passport');
const SessionController = require('../controllers/session.controller');
const { SessionsService }= require('../services/sessionsService');
const { CartsService } = require('../services/cartsService');

class SessionRouter extends Router {
    init() {

        const withController = callback => {
            return (req, res) => {
                const service = new SessionsService(
                    req.app.get('sessionsStorage')
                )
                const cartsService = new CartsService(
                    req.app.get('cartsStorage')
                )
                const controller = new SessionController(service, cartsService)
                return callback(controller, req, res)
            }
        }

        this.post('/login', passport.authenticate('login', {failureRedirect: '/api/session/faillogin'}), withController((controller, req, res) => controller.createSession(req, res)));
        
        this.get('/faillogin', (req,res) => {
            res.send('Incorrect user or password')
        })
        
        this.get('/logout', withController((controller, req, res) => controller.deleteSession(req, res)));
        
        this.get('/failregister', (req,res) => {
            res.send('User is already registered!')
        })
        
        this.get('/github', passport.authenticate('github', {scope: ['user:email']}), (req, res) => {})
        
        this.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/'}), (req,res) => {
            req.session.user = {_id: req.user._id}
            res.redirect('/')
        })
                
        this.get('/current', withController((controller, req, res) => controller.getCurrent(req, res)));
    }
}

module.exports = SessionRouter