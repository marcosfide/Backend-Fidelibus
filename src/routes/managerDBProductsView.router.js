const { Router } = require('express')

const router = Router();


// Ruta para acceder al form de datos del producto a agregar
router.get('/', async (req, res) => {
    const productManager = req.app.get('productManager')
    try {       
        const products = await productManager.getProducts();
        
        res.render('managerDBProductsView', { // Renderizamos el listado y form
            products: products,
            title: 'Agregar producto',
            styles: [
                'product.css'
            ],
            title:'Product Manager'
        });
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).send("Error interno del servidor");
    }
});

// Ruta para agregar un producto
router.post('/', async(req, res) => {
    const productManager = req.app.get('productManager')
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


    res.status(201).json({status: 'success', product})

})


// Ruta para eliminar un producto
router.delete('/:pid', async(req, res) =>{
    try {
        const productManager = req.app.get('productManager')
        await productManager.deleteProductById(req.params.pid)

        res.status(200).json({ success: true })
    }
    catch (err) {
        return res.status(500).json({ success: false })
    }
})



module.exports = router