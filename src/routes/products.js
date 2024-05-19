const Router = require('./router')

class ProductsRouter extends Router {
    init() {

        // Ruta para obtener un producto por Id
        this.get('/:pid', async (req, res) => {
            try {
                const productManager = req.app.get('productManager')
                const productId = req.params.pid;
            
                const product = await productManager.getProductById(productId);
            
                if (!product) {
                    res.status(400).json({ error: 'Producto no encontrado.' })
                    return;
                }
                res.status(200).json(product);
                
            } catch (err) {
                return res.status(500).json({ success: false })
            }
        });

        // Ruta para obtener todos los productos o filtrarlos
        this.get('/', async (req, res) => {
            try {
                const productManager = req.app.get('productManager');
                const products = await productManager.getProducts(req.query);

                const baseUrl = req.baseUrl;
                const queryParams = req.query;

                // Obtener los enlaces previo y siguiente
                const prevLink = await productManager.buildPrevLink(baseUrl, queryParams, products.page);
                const nextLink = await productManager.buildNextLink(baseUrl, queryParams, products.page, products.totalPages);

                // Enviar los enlaces en la respuesta
                res.status(201).json({
                    status: 'success',
                    payload: products.docs,
                    totalPages: products.totalPages,
                    prevPage: products.prevPage,
                    nextPage: products.nextPage,
                    page: products.page,
                    hasPrevPage: products.hasPrevPage,
                    hasNextPage: products.hasNextPage,
                    prevLink: prevLink? `http://localhost:8080${prevLink}` : null,
                    nextLink: nextLink ? `http://localhost:8080${nextLink}` : null,
                });
            } catch (error) {
                console.error('Error al obtener los productos:', error);
                res.status(500).json({ status: 'error', error: 'Error interno del servidor.' });
            }
        });
        
        // Ruta para agregar un producto
        this.post('/', async (req, res) => {
            const productManager = req.app.get('productManager');
            const product = req.body;

            try {
                const result = await productManager.addProduct(product);

                if (result.error) {
                    res.status(400).json({ error: result.error });
                } else {
                    res.status(201).json({ status: 'success', product });
                }
            } catch (error) {
                console.error('Error al intentar agregar el producto:', error);
                res.status(500).json({ error: 'Error interno del servidor al intentar agregar el producto.' });
            }
        });

        // Ruta para actualizar datos de un producto
        this.put('/:pid', async (req, res) => {
            const productManager = req.app.get('productManager');
            const updatedFields = req.body;
            const idProductToUpdate = req.params.pid;

            try {
                await productManager.updateProduct(idProductToUpdate, updatedFields);

                res.status(201).json({ status: 'success', updatedFields });
            } catch (error) {
                console.error('Error al intentar actualizar el producto:', error);
                res.status(500).json({ error: 'Error interno del servidor al intentar actualizar el producto.' });
            }
        });

        // Ruta para eliminar un producto
        this.delete('/:pid', async(req, res) =>{
            try {
                const productManager = req.app.get('productManager')
                await productManager.deleteProductById(req.params.pid)

                res.status(200).json({ success: true })
            }
            catch (err) {
                return res.status(500).json({ success: false })
            }
        })
    }
}

module.exports = ProductsRouter