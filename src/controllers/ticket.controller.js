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

            let cartUpdated = []
            const productsOutOfStock = []
            for (const cartItem of cart.products) {
                const stock = await this.productService.getStockById(cartItem.product._id);
                if (cartItem.quantity <= stock) {
                    await this.productService.subtractFromStock(cartItem._id,cartItem.quantity)
                    cartUpdated.push(cartItem)
                }
                if (cartItem.quantity > stock) {
                    productsOutOfStock.push(cartItem.product)
                    console.log(`El producto ${cartItem.product.title} no ha sido incluido en su compra debido a que no hay suficiente stock`)
                }
            }

            let messageOutOfStock = 'Se ha procesado la compra correctamente con todos los productos!'
            if (productsOutOfStock.length > 0) {
                messageOutOfStock = `Los productos: ${productsOutOfStock} no fueron incluídos en la compra por falta de stock`;
            }

            const totalCart = await this.cartService.getTotalCart(cartUpdated);

            console.log('cart Updated', cartUpdated);

            const ticketProducts = cartUpdated.map(cartItem => ({
                productId: cartItem.product._id,
                productName: cartItem.product.title,
                productPrice: cartItem.product.price,
                productQuantity: cartItem.quantity,
                productTotalAmount: cartItem.quantity * cartItem.product.price
            }));

            console.log('ricketproductsss', ticketProducts);
    
            const ticketData = {
                code: this.generateUniqueCode(),
                purchase_datatime: new Date(),
                products: ticketProducts,
                amount: totalCart,
                purchaser: user.email
            };
    
            await this.ticketService.createOne(ticketData);
            await this.cartService.clearCart(cartId)

            res.status(201).json({ status: 'success', message: 'Se ha creado un nuevo ticket', ticketData, messageOutOfStock});
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