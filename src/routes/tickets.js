const Router = require('./router')
const TicketController = require ('../controllers/ticket.controller')
const { CartsService } = require('../services/cartsService')
const { UsersService } = require('../services/usersService')
const { TicketsService } = require('../services/ticketsService')
const { ProductsService } = require('../services/productsService')

class TicketsRouter extends Router {
    init() {

        const withController = callback => {
            return (req, res) => {
                const cartService = new CartsService(
                    req.app.get('cartsStorage')
                )
                const userService = new UsersService(
                    req.app.get('usersStorage')
                )
                const ticketService = new TicketsService(
                    req.app.get('ticketsStorage')
                )
                const productService = new ProductsService(
                    req.app.get('productsStorage')
                )
                const controller = new TicketController(cartService, userService, ticketService, productService)
                return callback(controller, req, res)
            }
        }
        
        // Ruta para obtener los tickets
        this.get('/', withController((controller, req, res) => controller.getTickes(req, res)));

        // Ruta para crear un nuevo ticket
        this.post('/:cid/purchase', withController((controller, req, res) => controller.createTicket(req, res)));


    }
}

module.exports = TicketsRouter