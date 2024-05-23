const User = require('../dao/models/user.model')
const { emailAdmin } = require ('../env-config/adminConfig');

class ViewController {
    
    constructor(productService, cartService){
        this.productService = productService
        this.cartService = cartService
    }

    async getHome(req, res){
        const isLoggedIn = ![null, undefined].includes(req.session.user)

        res.render('index', {
            title: 'Home',
            useWS: true,
            scripts: [
                'index.js'
            ],
            isLoggedIn,
            isNotLoggedIn: !isLoggedIn
        })
    }

    async getLogin(req, res){
        res.render('login', {
            title: 'Login',
        })
    }

    async getResetPassword(req, res){
        res.render('resetPassword', {
            title: 'Reset password',
        })
    }

    async getRegister(req, res){
        res.render('register', {
            title: 'Register',
        })
    }

    async getProfile(req, res){
        if (!req.session.user || !req.session.user._id) {
            return res.status(401).send('Unauthorized');
        }

        try {
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

            res.render('profile', {
                title: 'My profile',
                user: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    age: user.age,
                    email: user.email,
                    rol: user.rol
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    }

    async getRenderProduct(req, res) {
        try {
            const productId = req.params.pid;
            const idFromSession = req.session.user._id;
            const user = await User.findOne({_id: idFromSession});
    
            if (!user) {
                return res.status(404).send('User not found');
            }
            console.log(productId);
            const product = await this.productService.getById(productId);
            if (!product) {
                return res.status(400).json({ error: 'Producto no encontrado.' });
            }
            console.log(product);

            return res.render('product', {
                title: 'Producto por id',
                product: product,
                styles: [
                    'product.css'
                ],
                scripts: [
                    'product.js'
                ],
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            });
    
        } catch (error) {
            console.log(error);
            return res.status(500).send(`Error interno del servidor: ${error.message}`);
        }
    }

    // Función para construir el enlace previo
    async buildPrevLink (baseUrl, queryParams, currentPage){
        const prevPage = currentPage - 1;
        if (prevPage >= 1) {
            queryParams.page = prevPage; // Modificar el parámetro de consulta page
            return `${baseUrl}?${new URLSearchParams(queryParams)}`;
        } else {
            return null; // No hay página anterior
        }
    };
    // Función para construir el enlace siguiente
    async buildNextLink(baseUrl, queryParams, currentPage, totalPages){
        const nextPage = currentPage + 1;
        if (nextPage <= totalPages) {
            queryParams.page = nextPage; // Modificar el parámetro de consulta page
            return `${baseUrl}?${new URLSearchParams(queryParams)}`;
        } else {
            return null; // No hay página siguiente
        }
    };

    async getRenderProducts(req, res) {
        try {
            let { limit, page, sort, category, availability } = req.query;
            limit = limit ? limit : 10;
            page = page ? page : 1;
            const query = {};
                
            // Agregar filtro por categoría si está presente
            if (category) {
                query.category = category;
            }
    
            // Agregar filtro por disponibilidad de stock si no se especifica una categoría
            if (availability === 's') {
                query.stock = { $gte: 1 };
            } else if(availability === 'n'){
                query.stock = 0;
            }
    
            const options = {
                limit: limit,
                page: page,
                sort: sort ? { price: sort } : undefined,
                lean: true
            };
    
            const products = await this.productService.paginate(query, options);

            // Validar si page no está definido o es menor que 1
            if (isNaN(page) || page < 1 || page > products.totalPages) {
                throw new Error('¡Página no válida!');
            }

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
            const prevLink = await this.buildPrevLink(baseUrl, queryParams, products.page);
            const nextLink = await this.buildNextLink(baseUrl, queryParams, products.page, products.totalPages);

            res.render('products', {
                title: 'Productos',
                products: products.docs,
                prevLink: prevLink ? `http://localhost:8080/products${prevLink}` : null,
                nextLink: nextLink ? `http://localhost:8080/products${nextLink}` : null,
                page: products.page,
                totalPages: products.totalPages,
                styles: [
                    'product.css'
                ],
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                rol: user.rol
            });
            return products
        } catch (error) {
            res.status(500).send(`Error interno del servidor: ${error.message}`);
        }
    }
    
    async getCartById(req, res) {
        try {
            const cartId = req.params.cid
            const cart = await this.cartService.getById(cartId)
            
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
            res.status(500).send(`Error interno del servidor: ${error.message}`);
        }
    }
}


module.exports = ViewController