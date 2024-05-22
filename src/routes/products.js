const Router = require('./router')
const ProductController = require ('../controllers/product.controller')
const { ProductsService } = require('../services/productsService')

class ProductsRouter extends Router {
    init() {

        const withController = callback => {
            return (req, res) => {
                const service = new ProductsService(
                    req.app.get('productsStorage')
                )
                const controller = new ProductController(service)
                return callback(controller, req, res)
            }
        }

        // Ruta para obtener todos los productos o filtrarlos
        this.get('/', withController((controller, req, res) => controller.getProducts(req, res)));

        // Ruta para obtener un producto por Id
        this.get('/:pid', withController((controller, req, res) => controller.getProductById(req, res)));
        
        // Ruta para agregar un producto
        this.post('/', withController((controller, req, res) => controller.addProduct(req, res)));

        // Ruta para actualizar datos de un producto
        this.put('/:pid', withController((controller, req, res) => controller.updateProduct(req, res)));

        // Ruta para eliminar un producto
        this.delete('/:pid', withController((controller, req, res) => controller.deleteProductById(req, res)));
    }
}

module.exports = ProductsRouter