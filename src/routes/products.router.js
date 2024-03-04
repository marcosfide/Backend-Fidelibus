const { Router } = require('express')

const ProductManager = require('../ProductManager');

const router = Router();

const productManager = new ProductManager('./src/productos.json');

// Ruta para obtener un producto por Id
router.get('/:pid', async (req, res) => {
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

    res.status(200).json(product);
});

// Ruta para obtener todos los productos o limitar la cantidad
router.get('/', async (req, res) => {
    let limit = req.query.limit;
    let products;

    // Verifico si se proporcionó un parámetro de consulta "limit"
    if (limit !== undefined) {
        limit = parseInt(limit); // Convertir a entero
        // Verificar si el valor de "limit" es un número válido
        if (isNaN(limit) || limit <= 0) {
            res.status(400).json({ error: 'El parámetro de consulta "limit" debe ser un número entero positivo.' })
            return;
        }
        // obtengo los productos con el límite proporcionado
        const allProducts = await productManager.getProducts();
        products = allProducts.slice(0, limit);
    } else {
        // si no se proporciona "limit", traigo todos los productos
        products = await productManager.getProducts();
    }

    res.status(200).json(products);
});

// Ruta para agregar un producto
router.post('/', async(req, res) => {
    const product = req.body

    const requiredFields = product.title && product.description && product.code && product.price && product.status && product.stock && product.category;
    const textFields = typeof product.title === 'string' && typeof product.description === 'string' && typeof product.code === 'string' && typeof product.category === 'string';
    const numberFields = typeof product.price === 'number' && product.price > 0 && typeof product.stock === 'number' && product.stock >= 0;
    const statusField = typeof product.status === 'boolean';
    const thumbnailField = Array.isArray(product.thumbnail) && product.thumbnail.every(item => typeof item === 'string');

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

    if(!thumbnailField){
        res.status(400).json({ error: "El campo thumbnail debe ser un array de strings." })
        return;
    }

    productManager.addProduct(product)

    res.status(201).json({status: 'success', product})
})

// Ruta para actualizar datos de un producto
router.put('/:pid', async(req, res) =>{
    const updatedFields = req.body
    const idProductToUpdate = parseInt(req.params.pid)
    
    if (isNaN(idProductToUpdate) || idProductToUpdate <= 0) {
        res.status(400).json({ error: 'El Id del producto debe ser un número entero positivo.' })
        return;
    }
    const product = await productManager.getProductById(idProductToUpdate);
    if (!product) {
        res.status(400).json({ error: 'Producto no encontrado.' })
        return;
    }

    if( updatedFields.title && typeof updatedFields.title !== 'string'){
        res.status(400).json({ error: "El campo title debe ser un string." })
        return;
    }
    if( updatedFields.description && typeof updatedFields.description !== 'string'){
        res.status(400).json({ error: "El campo description debe ser un string." })
        return;
    }
    if( updatedFields.code && typeof updatedFields.code !== 'string'){
        res.status(400).json({ error: "El campo code debe ser un string." })
        return;
    }
    if( updatedFields.category && typeof updatedFields.category !== 'string'){
        res.status(400).json({ error: "El campo category debe ser un string." })
        return;
    }
    if( updatedFields.price && typeof updatedFields.price !== 'number'){
        res.status(400).json({ error: "El campo price debe ser un number." })
        return;
    }
    if( updatedFields.stock && typeof updatedFields.stock !== 'number'){
        res.status(400).json({ error: "El campo stock debe ser un number." })
        return;
    }
    if( updatedFields.status && typeof updatedFields.status !== 'boolean'){
        res.status(400).json({ error: "El campo status debe ser un boolean." })
        return;
    }
    if (updatedFields.thumbnail && (!Array.isArray(updatedFields.thumbnail) || !updatedFields.thumbnail.every(item => typeof item === 'string'))) {
        res.status(400).json({ error: "El campo thumbnail debe ser un array de strings." });
        return;
    }


    const productsFile = await productManager.getProducts()
    const isInProducts = productsFile.some(prod => prod.code === updatedFields.code);
    
    if (isInProducts) {
        res.status(400).json({ error: `El código de producto ${product.code} ya se encuentra en products` })
        return;
    }

    await productManager.updateProduct([idProductToUpdate,updatedFields])

    res.status(201).json({status: 'success', updatedFields})
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


    res.status(201).json({status: 'success', product})

})

module.exports = router