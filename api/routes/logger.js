const LoggerController = require('../controllers/logger.controller');
const Router = require('./router');

class LoggerRouter extends Router {
    init() {
        const withController = callback => {
            return (req, res) => {
                const controller = new LoggerController();
                return callback(controller, req, res);
            };
        };
        this.get('/', withController((controller, req, res) => controller.startLogerTest(req, res)));
    }
}

module.exports = LoggerRouter;
