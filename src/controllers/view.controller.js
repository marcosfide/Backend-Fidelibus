const User = require('../dao/models/user.model')
const { emailAdmin, emailSuperAdmin } = require ('../env-config/adminConfig');

class ViewController {
    
    constructor(productService, cartService, sessionService, userService){
        this.productService = productService
        this.cartService = cartService
        this.sessionService = sessionService
        this.userService = userService
    }

    async getHome(req, res) {
        // Verifica si req.session.user está definido
        const isLoggedIn = req.session.user !== undefined && req.session.user !== null;
    
        // Inicializa isAdmin como false
        let isAdmin = false;
        let user = null;
    
        if (isLoggedIn) {
            // Verifica si req.session.user.email está definido
            if (req.session.user.email) {
                isAdmin = req.session.user.email === emailAdmin || req.session.user.email === emailSuperAdmin;
                // Obtén el usuario solo si no es administrador
                if (!isAdmin) {
                    user = await this.userService.getByEmail(req.session.user.email);
                }
            }
        }
    
        // Determina si el usuario es premium o administrador
        const isPremium = user ? user.rol === 'Premium' : isAdmin ? 'Admin' : false;
    
        res.render('index', {
            title: 'Home',
            useWS: true,
            scripts: ['index.js'],
            isLoggedIn,
            isNotLoggedIn: !isLoggedIn,
            isAdmin,
            isNotAdmin: !isAdmin,
            isPremium
        });
    }    

    async getLogin(req, res){
        res.render('login', {
            title: 'Login',
        })
    }

    async getEmailToSendResetPassword(req, res){
        res.render('emailToSendResetPassword', {
            title: 'Reset password',
        })
    }

    async getResetPassword(req, res) {
        const { token } = req.query;
        res.render('resetPassword', {
            title: 'Reset password',
            token: token
        });
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
            let isAdmin = false;
            let user = null;
            
            if (req.session.user.email) {
                isAdmin = req.session.user.email === emailAdmin || req.session.user.email === emailSuperAdmin;
            }

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
            } else if (req.session.user.email === emailSuperAdmin) {
                // Utilizar el objeto de usuario administrativo creado dinámicamente
                user = {
                    firstName: 'Super',
                    lastName: 'Admin',
                    age: 28,
                    email: emailSuperAdmin,
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

            const isPremium = user ? user.rol === 'Premium' : isAdmin ? 'Admin' : false;

            res.render('profile', {
                title: 'My profile',
                user: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    age: user.age,
                    email: user.email,
                    rol: user.rol,
                    id: user._id,
                    documents: user.documents || []
                },
                isAdmin,
                isNotAdmin: !isAdmin,
                isPremium
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
            const isLoggedIn = ![null, undefined].includes(req.session.user)
            const isAdmin = isLoggedIn ? req.session.user.email === emailAdmin || req.session.user.email === emailSuperAdmin : false
    
            if (!user) {
                return res.status(404).send('User not found');
            }

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
                email: user.email,
                isAdmin ,
                isNotAdmin: !isAdmin
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
            const isLoggedIn = ![null, undefined].includes(req.session.user)
            const isAdmin = isLoggedIn ? req.session.user.email === emailAdmin || req.session.user.email === emailSuperAdmin : false
                
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
            } else if (req.session.user.email === emailSuperAdmin) {
                // Utilizar el objeto de usuario administrativo creado dinámicamente
                user = {
                    firstName: 'Super',
                    lastName: 'Admin',
                    age: 28,
                    email: emailSuperAdmin,
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

            const isPremium = user ? user.rol === 'Premium' : isAdmin ? 'Admin' : false;

            // Obtener los enlaces previo y siguiente
            const prevLink = await this.buildPrevLink(baseUrl, queryParams, products.page);
            const nextLink = await this.buildNextLink(baseUrl, queryParams, products.page, products.totalPages);

            res.render('products', {
                title: 'Productos',
                products: products.docs,
                prevLink: prevLink ? `${process.env.BASE_URL}products${prevLink}` : null,
                nextLink: nextLink ? `${process.env.BASE_URL}products${nextLink}` : null,
                page: products.page,
                totalPages: products.totalPages,
                styles: [
                    'product.css'
                ],
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                rol: user.rol,
                isAdmin ,
                isNotAdmin: !isAdmin,
                isPremium
            });
            return products
        } catch (error) {
            res.status(500).send(`Error interno del servidor: ${error.message}`);
        }
    }
    
    async getCartById(req, res) {
        try {
            const user = await this.userService.getById(req.session.user._id)
            const cartId = user.cart;
            const cart = await this.cartService.getById(cartId)
            console.log(cartId);
            if (!cart) {
                res.status(400).json({ error: 'cart no encontrado.' });
                return;
            }
            
            // Calcula el total del carrito
            const totalCart = await this.cartService.getTotalCart(cart.products)

            let isAdmin = false;

            if (req.session.user.email) {
                isAdmin = req.session.user.email === emailAdmin || req.session.user.email === emailSuperAdmin;
            }

            const isPremium = user ? user.rol === 'Premium' : isAdmin ? 'Admin' : false;
            
            res.render('cart', {
                cart: cart,
                cartProducts: cart.products,
                title: 'Cart',
                totalCart: totalCart,
                styles: [
                    'product.css'
                ],
                isAdmin,
                isNotAdmin: !isAdmin,
                isPremium
            });

            return cart

        } catch (error) {
            res.status(500).send(`Error interno del servidor: ${error.message}`);
        }
    }

    async getProductsManager(req, res, next) {
        try {
            const userEmail = req.session.user.email;
            const products = await this.productService.getProductsManager(req.query, userEmail);
    
            let isAdmin = false;
            let user = null;
            
            if (req.session.user.email) {
                isAdmin = req.session.user.email === emailAdmin || req.session.user.email === emailSuperAdmin;
                // Obtén el usuario solo si no es administrador
                if (!isAdmin) {
                    user = await this.userService.getByEmail(req.session.user.email);
                }
            }
            const isPremium = user ? user.rol === 'Premium' : isAdmin ? 'Admin' : false;

            const baseUrl = req.baseUrl;
            const queryParams = req.query;
            // Obtener los enlaces previo y siguiente
            const prevLink = await this.buildPrevLink(baseUrl, queryParams, products.page);
            const nextLink = await this.buildNextLink(baseUrl, queryParams, products.page, products.totalPages);
    
            res.render('managerProducts', { // Renderizamos el listado y form
                products: products.docs,
                prevLink: prevLink ? `${process.env.BASE_URL}productsManager/${prevLink}` : null,
                nextLink: nextLink ? `${process.env.BASE_URL}productsManager/${nextLink}` : null,
                page: products.page,
                totalPages: products.totalPages,
                styles: [
                    'product.css'
                ],
                title: 'Product Manager',
                isAdmin,
                isNotAdmin: !isAdmin,
                isPremium
            });
        } catch (error) {
            console.error("Error al obtener productos:", error);
            res.status(500).send("Error interno del servidor");
        }
    }

    async getUsersManager(req, res, next) {
        try {
            const users = await this.userService.getUsers();
    
            const baseUrl = req.baseUrl;
            const queryParams = req.query;
            // Obtener los enlaces previo y siguiente
            const prevLink = await this.buildPrevLink(baseUrl, queryParams, users.page);
            const nextLink = await this.buildNextLink(baseUrl, queryParams, users.page, users.totalPages);
    
            res.render('usersManager', {
                users: users,
                prevLink: prevLink ? `${process.env.BASE_URL}usersManager/${prevLink}` : null,
                nextLink: nextLink ? `${process.env.BASE_URL}usersManager/${nextLink}` : null,
                page: users.page,
                totalPages: users.totalPages,
                styles: [
                    'product.css'
                ],
                title: 'User Manager',
            });
        } catch (error) {
            console.error("Error al obtener useros:", error);
            res.status(500).send("Error interno del servidor");
        }
    }
    
}


module.exports = ViewController