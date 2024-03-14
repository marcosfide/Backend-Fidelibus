const { Router } = require('express')

const ProductManager = require('../ProductManager');

const router = Router();

const productManager = new ProductManager('./src/productos.json');


// Ruta para acceder al form de datos del producto a agregar
router.get('/', async (req, res) => {
    try {       
        const products = await productManager.getProducts();
        
        res.render('realTimeProducts', { // Renderizamos el listado y form
            products: products,
            title: 'Agregar producto',
            styles: [
                'product.css'
            ],
            title:'Websockets',
            useWS: true,
            scripts: [
                'realTimeProducts.js'
            ]
        });
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).send("Error interno del servidor");
    }
});

// Ruta para agregar un producto
router.post('/', async(req, res) => {
    const product = req.body
    
    product.price = parseInt(product.price)
    product.stock = parseInt(product.stock)
    product.status ?  product.status = true : product.status = false;


    const requiredFields = product.title && product.description && product.code && product.price && product.stock && product.category;
    const textFields = typeof product.title === 'string' && typeof product.description === 'string' && typeof product.code === 'string' && typeof product.category === 'string';
    const numberFields = typeof product.price === 'number' && product.price > 0 && typeof product.stock === 'number' && product.stock >= 0;
    const statusField = typeof product.status === 'boolean';

    const productsFile = await productManager.getProducts()
    const isInProducts = productsFile.some(prod => prod.code === product.code);
    
    if (isInProducts) {
        res.status(400).json({ error: `El código de producto ${product.code} ya se encuentra en products` })
        return;
    }

    if(!requiredFields){
        res.status(400).json({ error: "Todos los campos deben tener valores." })
        return;
    }

    if(!textFields){
        res.status(400).json({ error: "Los campos title, description, code y category deben ser string." })
        return;
    }

    if(!numberFields){
        res.status(400).json({ error: "Los campos price y stock deben ser de tipo number y mayores o igual a 0." })
        return;
    }

    if(!statusField){
        res.status(400).json({ error: "El campo status debe ser tipo boolean." })
        return;
    }

    // 1ro Agregar el producto con el productManager
    await productManager.addProduct(product)

    // 2do Notificar a los clientes(browsers) mediante WS que se agrrego un nuevo producto
    req.app.get('ws').emit('newProduct', product)


    res.status(201).json({status: 'success', product})

})


// Ruta para eliminar un producto
router.delete('/:pid', async(req, res) =>{
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

    productManager.deleteProduct(productId)

    // Notificar a los clientes(browsers) mediante WS que se agrrego un nuevo producto
    req.app.get('ws').emit('productDeleted', product)


    res.status(201).json({status: 'success', product})

})


module.exports = router