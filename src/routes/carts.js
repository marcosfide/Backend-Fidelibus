const Router = require('./router')
const CartController = require ('../controllers/cart.cotroller')
const { CartsService } = require('../services/cartsService')
const { UsersService } = require('../services/usersService')

class CartsRouter extends Router {
    init() {

        const withController = callback => {
            return (req, res) => {
                const cartService = new CartsService(
                    req.app.get('cartsStorage')
                )
                const userService = new UsersService(
                    req.app.get('usersStorage')
                )
                const controller = new CartController(cartService, userService)
                return callback(controller, req, res)
            }
        }
        
        // Ruta para obtener los carritos
        this.get('/', withController((controller, req, res) => controller.getCarts(req, res)));

        // Ruta para obtener los productos del carrito por id
        this.get('/:cid', withController((controller, req, res) => controller.getCartById(req, res)));

        // Ruta para crear un nuevo carrito
        this.post('/', withController((controller, req, res) => controller.addCart(req, res)));

        // Ruta para agregar el producto al arreglo products del carrito seleccionado por id
        this.post('/:cid/product/:pid', withController((controller, req, res) => controller.addProductToCart(req, res)));

        // Ruta para agregar el producto al arreglo products del carrito seleccionado por id
        this.post('/product/:pid', withController((controller, req, res) => controller.addProductToCartView(req, res)));

        // Ruta para eliminar un producto por id correspondiente al carrito seleccionado por id
        this.delete('/:cid/products/:pid', withController((controller, req, res) => controller.deleteProductFromCart(req, res)));

        // Ruta para eliminar un producto por id correspondiente al carrito seleccionado por id
        this.delete('/product/:pid', withController((controller, req, res) => controller.deleteProductFromCartView(req, res)));

        // Ruta para actualizar los productos de un carrito por id de cart
        this.put('/:cid', withController((controller, req, res) => controller.updateCartProducts(req, res)));

        // Ruta para actualizar la cantidad de productos del prod id corerspondiente al cart id pasados por parametros
        this.put('/:cid/products/:pid', withController((controller, req, res) => controller.updateQuantityCartProduct(req, res)));

        // Ruta para eliminar todos los productos del carrito
        this.delete('/:cid', withController((controller, req, res) => controller.clearCart(req, res)));

    }
}

module.exports = CartsRouter