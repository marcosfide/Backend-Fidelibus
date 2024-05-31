const mongoose = require('mongoose');

class TicketController {
    
    constructor(cartService, userService, ticketService, productService){
        this.cartService = cartService
        this.userService = userService
        this.ticketService = ticketService
        this.productService = productService
    }

    #handleError(res, err) {
        if (err.message === 'not found') {
            return res.status(404).json({ error: 'Not found' });
        }
        if (err.message === 'invalid params') {
            return res.status(400).json({ error: 'Invalid params' });
        }
        return res.status(500).json({ error: err.message });
    }
    
    async getTickets(req, res) {
        try {
            const tickets = await this.ticketService.getAll()
            res.status(200).json(tickets);
        } catch (error) {
            res.status(500).json({ error: 'Error al buscar los tickets' });
        }
    }

    async createTicket(req, res) {
        try {
            const user = await this.userService.getById(req.session.user._id);
            const cartId = user.cart;
    
            const cart = await this.cartService.getById(cartId)

            // Validar el stock de cada producto en el carrito
            for (const cartItem of cart.products) {
                const stock = await this.productService.getStockById(cartItem.product._id);
                if (cartItem.quantity > stock) {
                    return res.status(400).json({ 
                        status: 'error', 
                        message: `No hay suficiente stock para el producto ${cartItem.product.title}` 
                    });
                }
            }
            const totalCart = await this.cartService.getTotalCart(cartId);
    
            const ticketData = {
                code: this.generateUniqueCode(),
                purchase_datatime: new Date(),
                amount: totalCart,
                purchaser: user.email
            };
    
            await this.ticketService.createOne(ticketData);
            res.status(201).json({ status: 'success', message: 'Se ha creado un nuevo ticket' });
        } catch (error) {
            return this.#handleError(res, error);
        }
    }
    
    generateUniqueCode() {
        return 'xxxx-xxxx-xxxx-xxxx'.replace(/[x]/g, () => {
            return (Math.random() * 16 | 0).toString(16);
        });
    }
    


}


module.exports = TicketController