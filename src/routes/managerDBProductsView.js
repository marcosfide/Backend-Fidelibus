const Router = require('./router')

const User = require('../dao/models/user.model')
const {userIsAdmin} = require('../middlewares/auth.middleware')
const { emailAdmin, passwordAdmin } = require ('../env-config/adminConfig');

class ManagerDBProductsViewRouter extends Router {
    init() {

        // Ruta para acceder al form de datos del producto a agregar
        this.get('/', userIsAdmin, async (req, res) => {
            try {
                const productManager = req.app.get('productManager');
                const products = await productManager.getProducts(req.query);
                const baseUrl = req.baseUrl;
                const queryParams = req.query;
                let user;

                // Verificar si el usuario autenticado es administrativo
                if (req.session.user.email === emailAdmin) {
                    // Utilizar el objeto de usuario administrativo creado dinámicamente
                    user = {
                        firstName: 'Administrador',
                        lastName: 'Primero',
                        age: 28,
                        email: emailAdmin,
                        rol: 'Admin'
                    };
                } else {
                    // Buscar el usuario en la base de datos
                    const idFromSession = req.session.user._id;
                    user = await User.findOne({ _id: idFromSession });
                    if (!user) {
                        return res.status(404).send('User not found');
                    }
                }

                // Obtener los enlaces previo y siguiente
                const prevLink = await productManager.buildPrevLink(baseUrl, queryParams, products.page);
                const nextLink = await productManager.buildNextLink(baseUrl, queryParams, products.page, products.totalPages);

                res.render('managerDBProductsView', { // Renderizamos el listado y form
                    products: products.docs,
                    title: 'Agregar producto',
                    products: products.docs,
                    prevLink: prevLink ? `http://localhost:8080${prevLink}` : null,
                    nextLink: nextLink ? `http://localhost:8080${nextLink}` : null,
                    page: products.page,
                    totalPages: products.totalPages,
                    styles: [
                        'product.css'
                    ],
                    title: 'Product Manager'
                });
                return products
            } catch (error) {
                console.error("Error al obtener productos:", error);
                res.status(500).send("Error interno del servidor");
            }
        });

        // Ruta para agregar un producto
        this.post('/', async(req, res) => {
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

        })

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

module.exports = ManagerDBProductsViewRouter
