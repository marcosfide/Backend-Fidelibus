const Router = require('./router')
const ProductController = require ('../controllers/product.controller')
const { ProductsService } = require('../services/productsService')

class ProductsRouter extends Router {
    init() {

        const withController = callback => {
            return (req, res, next) => {
                const service = new ProductsService(
                    req.app.get('productsStorage')
                );
                const controller = new ProductController(service);
                return callback(controller, req, res, next); 
            };
        };
        
        // Ruta para obtener todos los productos o filtrarlos
        this.get('/', withController((controller, req, res, next) => controller.getProducts(req, res, next)));

        // Ruta para obtener un producto por Id
        this.get('/:pid', withController((controller, req, res, next) => controller.getProductById(req, res, next)));

        // Ruta para agregar un producto
        this.post('/', withController((controller, req, res, next) => controller.addProduct(req, res, next)));

        // Ruta para actualizar datos de un producto
        this.put('/:pid', withController((controller, req, res, next) => controller.updateProduct(req, res, next)));

        // Ruta para eliminar un producto
        this.delete('/:pid', withController((controller, req, res, next) => controller.deleteProductById(req, res, next)));
    }
}

module.exports = ProductsRouter