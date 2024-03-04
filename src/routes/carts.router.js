const { Router } = require('express')

const ProductManager = require('../ProductManager');

const router = Router();


const productManager = new ProductManager('./src/carritos.json');

// Ruta para crear un nuevo carrito
router.post('/', (req, res) =>{

    productManager.addCart()

    res.status(201).json({status: 'success', message:'Se ha creado el listado de carritos'})
})

// Ruta para obtener los productos del carrito por id
router.get('/:cid', async (req, res) => {
    const cartId = parseInt(req.params.cid)
    if (cartId <= 0) {
        res.status(400).json({ error: 'El Id del producto debe ser un número entero positivo.' })
        return;
    }

    const cart = await productManager.getCartById(cartId);
    
    if (!cart) {
        res.status(400).json({ error: 'cart no encontrado.' })
        return;
    }

    res.status(200).json(cart);
});

// Ruta para agregar el producto al arreglo products del carrito seleccionado por id
router.post('/:cid/product/:pid', async (req, res) => {
    const cartId = parseInt(req.params.cid)
    const productId = parseInt(req.params.pid)

    if (isNaN(cartId) || isNaN(productId) || cartId <= 0 || productId <= 0) {
        res.status(400).json({ error: 'El Id del carrito y del producto deben ser números enteros positivos.' });
        return;
    }

    try {
        // Obtener el carrito y el producto correspondientes a los IDs proporcionados
        const cart = await productManager.getCartById(cartId);
        const product = await productManager.getProductById(productId);

        // Verificar si el carrito y el producto existen
        if (!cart) {
            res.status(400).json({ error: 'Carrito no encontrado.' });
            return;
        }
        if (!product) {
            res.status(400).json({ error: 'Producto no encontrado.' });
            return;
        }

        // Verificar si el producto ya está en el carrito
        const existingProductIndex = cart.products.findIndex(item => item.product === productId);
        if (existingProductIndex !== -1) {
            // Si el producto ya está en el carrito, incrementar la cantidad
            cart.products[existingProductIndex].quantity++;
        } else {
            // Si el producto no está en el carrito, agregarlo al arreglo "products" del carrito
            cart.products.push({ product: productId, quantity: 1 });
        }

        // Guardar el carrito actualizado
        await productManager.updateCart(cartId, cart);

        res.status(200).json({ status: 'success', message: 'Producto agregado al carrito correctamente.' });
    } catch (error) {
        console.error('Error al agregar el producto al carrito:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }

    res.status(200).json();
});

module.exports = router