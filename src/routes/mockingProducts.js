const Router = require('./router')
const { generateProduct } = require('../mocks/generateProduct')

class MockingProductsRouter extends Router {
    init() {

        // Ruta para obtener todos los productos o filtrarlos
        this.get('/',(req, res) => {
            const products = []
            for (let i = 0; i < 100; i++){
                products.push(generateProduct())
            }
            res.json(products)
        })
    }
}

module.exports = MockingProductsRouter