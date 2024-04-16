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

// Ruta para obtener todos los productos o filtrados por parametros
router.get('/products', async (req, res) => {
    try {
        const productManager = req.app.get('productManager');
        const products = await productManager.getProducts(req.query);
        console.log(products.docs);
        const baseUrl = req.baseUrl;
        const queryParams = req.query;

        // Obtener los enlaces previo y siguiente
        const prevLink = await productManager.buildPrevLink(baseUrl, queryParams, products.page);
        const nextLink = await productManager.buildNextLink(baseUrl, queryParams, products.page, products.totalPages);

        res.render('products', {
            products: products.docs,
            prevLink: prevLink ? `http://localhost:8080/products${prevLink}` : null,
            nextLink: nextLink ? `http://localhost:8080/products${nextLink}` : null,
            page: products.page,
            totalPages: products.totalPages,
            styles: [
                'product.css'
            ],
        });
        return products
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).send("Error interno del servidor");
    }
});

// Ruta para obtener cart por id
router.get('/carts/:cid', async (req, res) => {
    const cartManager = req.app.get('cartManager')
    const cartId = req.params.cid

    try {
        const cart = await cartManager.getCartById(cartId);
        
        if (!cart) {
            res.status(400).json({ error: 'cart no encontrado.' });
            return;
        }
        console.log(cart.products); // Verifica los datos antes de renderizar
        res.render('cart', {
            cartProducts: cart.products,
            title: 'Cart', // Puedes incluir un título aquí
            styles: [
                'product.css'
            ],
        });

        return cart

    } catch (error) {
        console.error("Error al obtener el cart:", error);
        res.status(500).send("Error interno del servidor");
    }
});


module.exports = router
