const { Router } = require('express')

const ProductManager = require('../ProductManager');

const router = Router();

const productManager = new ProductManager('./src/productos.json');


router.get('/', (_, res) => {
    res.render('index', {
        title:'Websockets',
        useWS: true,
        scripts: [
            'index.js'
        ]
    })
})

// Ruta para obtener todos los productos o limitar la cantidad y renderizarlo
router.get('/home', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        
        res.render('home', { // Renderizamos la vista 'productList'
            title: 'Lista de Productos',
            products: products,
            styles: [
                'product.css'
            ],
        });
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).send("Error interno del servidor");
    }
});

// Ruta para obtener un producto por Id y renderizarlo
router.get('/product/:pid', async (req, res) => {
    const productId = parseInt(req.params.pid);
    if (isNaN(productId) || productId <= 0) {
        res.status(400).json({ error: 'El Id del producto debe ser un número entero positivo.' })
        return;
    }

    const product = await productManager.getProductById(productId);
    if (!product) {
        res.status(400).json({ error: 'Producto no encontrado.' })
        return;
    }

    res.render('product', {
        title:'Producto por id',
        product: product,
        styles: [
            'product.css'
        ],
        scripts: [
            'product.js'
        ]
    })
});


module.exports = router
