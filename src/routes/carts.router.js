const { Router } = require('express')

const router = Router();


// Ruta para crear un nuevo carrito
router.post('/', (req, res) =>{
    const cartManager = req.app.get('cartManager')

    cartManager.addCart()

    res.status(201).json({status: 'success', message:'Se ha creado un nuevo carrito'})
})

// Ruta para obtener los carritos
router.get('/', async (req, res) => {
    const cartManager = req.app.get('cartManager')

    try {
        const cart = await cartManager.getCarts()
                
        res.status(200).json(cart);
        
    }  catch (error) {
        res.status(500).json({ error: 'Error al buscar los carts' });
    }
});

// Ruta para obtener los productos del carrito por id
router.get('/:cid', async (req, res) => {
    const cartManager = req.app.get('cartManager')
    const cartId = req.params.cid

    try {
        const cart = await cartManager.getCartById(cartId);
        
        if (!cart) {
            res.status(400).json({ error: 'cart no encontrado.' });
            return;
        }
        
        res.status(200).json(cart);
        
    }  catch (error) {
        res.status(500).json({ error: 'Error al buscar el cart por id. Id inapropiado' });
    }
});

// Ruta para agregar el producto al arreglo products del carrito seleccionado por id
router.post('/:cid/product/:pid', async (req, res) => {
    const cartManager = req.app.get('cartManager')
    const cartId = req.params.cid;
    const productId = req.params.pid;

    try {
        await cartManager.addProductToCart(cartId,productId)
        res.status(200).json({ status: 'success', message: 'Producto agregado al carrito correctamente.' });
    } catch (error) {
        console.error('Error al agregar el producto al carrito:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }

    res.status(200).json();
});

// Ruta para eliminar un producto por id correspondiente al carrito seleccionado por id
router.delete('/:cid/products/:pid', async (req, res) => {
    const cartManager = req.app.get('cartManager');
    const params = req.params

    try {
        cartManager.deleteProductFromCart(params)

        res.status(200).json({ status: 'success', message: 'Producto eliminado del carrito correctamente.' });
    } catch (error) {
        console.error('Error al eliminar el producto del carrito:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// Ruta para actualizar los productos de un carrito por id de cart
router.put('/:cid', async (req, res) => {
    const cartManager = req.app.get('cartManager');
    const cartId = req.params.cid
    const productsUpdated = req.body

    try {
        await cartManager.updateCartProducts(cartId, productsUpdated)

        res.status(200).json({ status: 'success', message: 'Carrito actualizado correctamente.' });
    } catch (error) {
        console.error('Error al intentar actualizar el carrito:', error);
        res.status(500).json({ error: 'Error interno del servidor. Id invalido?' });
        return;
    }
});

// Ruta para actualizar la cantidad de productos del prod id corerspondiente al cart id pasados por parametros
router.put('/:cid/products/:pid', async (req, res) => {
    const cartManager = req.app.get('cartManager')
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantityProduct = req.body.quantity

    try {
        await cartManager.updateQuantityCartProduct(cartId, productId, quantityProduct)

        res.status(200).json({ status: 'success', message: 'Carrito actualizado correctamente.' });
    } catch (error) {
        console.error('Error al intentar actualizar el carrito:', error);
        res.status(500).json({ error: 'Error interno del servidor. Id invalido?' });
        return;
    }
});

// Ruta para eliminar todos los productos del carrito
router.delete('/:cid', async (req, res) => {
    const cartManager = req.app.get('cartManager');
    const cartId = req.params.cid

    try {
        await cartManager.clearCart(cartId)

        res.status(200).json({ status: 'success', message: 'Productos elimnados del cart '+cartId });
    } catch (error) {
        console.error('Error al intentar eliminar los productos del carrito:', error);
        res.status(500).json({ error: 'Error interno del servidor. Id invalido?' });
        return;
    }
});



module.exports = router