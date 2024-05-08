const { Router } = require('express')
const User = require('../dao/models/user.model')
const {userIsLoggedIn, userIsNotLoggedId} = require('../middlewares/auth.middleware')

const router = Router();

// Rutas para home con login y register
router.get('/', (req, res) => {
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
});

// Ruta para login
router.get('/login', userIsNotLoggedId, (_, res) => {
    res.render('login', {
        title: 'Login',
    })
});

// Ruta para login
router.get('/resetPassword', userIsNotLoggedId, (_, res) => {
    res.render('resetPassword', {
        title: 'Reset password',
    })
});

// Ruta para register
router.get('/register', userIsNotLoggedId, (_, res) => {
    res.render('register', {
        title: 'Register',
    })
});

// Ruta para profile
router.get('/profile', userIsLoggedIn, async (req, res) => {
    if (!req.session.user || !req.session.user._id) {
        return res.status(401).send('Unauthorized');
    }

    try {
        let user;

        // Verificar si el usuario autenticado es administrativo
        if (req.session.user.email === 'adminCoder@coder.com') {
            // Utilizar el objeto de usuario administrativo creado dinámicamente
            user = {
                firstName: 'Administrador',
                lastName: 'Primero',
                age: 28,
                email: 'adminCoder@coder.com',
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
});

// Ruta para obtener un producto por Id y renderizarlo
router.get('/products/:pid', userIsLoggedIn, async (req, res) => {
    try{
        const productManager = req.app.get('productManager')
        const productId = req.params.pid;
        const idFromSession = req.session.user._id;
        const user = await User.findOne({_id: idFromSession});

        if (!user) {
            return res.status(404).send('User not found');
        }
    
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
            ],
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        });
    
    } catch (error) {
        res.status(500).send(`Error interno del servidor: ${error.message}`);
    }
});

// Ruta para obtener todos los productos o filtrados por parametros
router.get('/products', userIsLoggedIn, async (req, res) => {
    try {
        const productManager = req.app.get('productManager');
        const products = await productManager.getProducts(req.query);
        const baseUrl = req.baseUrl;
        const queryParams = req.query;
        let user;

        // Verificar si el usuario autenticado es administrativo
        if (req.session.user.email === 'adminCoder@coder.com') {
            // Utilizar el objeto de usuario administrativo creado dinámicamente
            user = {
                firstName: 'Administrador',
                lastName: 'Primero',
                age: 28,
                email: 'adminCoder@coder.com',
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
});


// Ruta para obtener cart por id
router.get('/carts/:cid', userIsLoggedIn, async (req, res) => {
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
        res.status(500).send(`Error interno del servidor: ${error.message}`);
    }
});


module.exports = router
