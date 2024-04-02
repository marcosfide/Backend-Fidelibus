const { Router } = require('express')

const router = Router();


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
    const productManager = req.app.get('productManager')
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
    const productManager = req.app.get('productManager')
    const productId = req.params.pid;

    const product = await productManager.getProductById(productId);
    if (!product) {
        res.status(400).json({ error: 'Producto no encontrado.' })
        return;
    }

    const productData = Object.assign({}, product.toJSON());
    res.render('product', {
        title: 'Producto por id',
        product: productData,
        styles: [
            'product.css'
        ],
        scripts: [
            'product.js'
        ]
    });

});


module.exports = router
