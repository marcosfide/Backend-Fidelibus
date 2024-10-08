class ProductController {
    
    constructor(service){
        this.service = service
    }

    #handleError(res, err) {
        if (err.message === 'not found') {
            return res.status(404).json({ error: 'Not found' });
        }
        if (err.message === 'invalid params') {
            return res.status(400).json({ error: 'Invalid params' });
        }
        return res.status(500).json({ error: err.message });
    }
    
    async getProducts(req, res){
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
    
            const products = await this.service.paginate(query, options);

            // Validar si page no está definido o es menor que 1
            if (isNaN(page) || page < 1 || page > products.totalPages) {
                throw new Error('¡Página no válida!');
            }

            const baseUrl = req.baseUrl;
            const queryParams = req.query;

            // Obtener los enlaces previo y siguiente
            const prevLink = await this.buildPrevLink(baseUrl, queryParams, products.page);
            const nextLink = await this.buildNextLink(baseUrl, queryParams, products.page, products.totalPages);

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
                prevLink: prevLink? `${process.env.BASE_URL}${prevLink}` : null,
                nextLink: nextLink ? `${process.env.BASE_URL}${nextLink}` : null,
            });
        } catch (error) {
            console.error('Error al obtener los productos:', error);
            res.status(500).json({ status: 'error', error: 'Error interno del servidor.' });
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

    async getProductById(req, res) {
        try {
            const productId = req.params.pid;
            const product = await this.service.getById(productId);
            
            if (!product) {
                return res.status(400).json({ error: 'Producto no encontrado.' });
            }
            res.status(200).json(product);
        } catch (error) {
            return this.#handleError(res, error);
        }
    }

    async addProduct(req, res, next) {
        try {
            const ownerEmail = req.session?.user?.email || 'Admin';
            console.log('owner', ownerEmail);
            const product = {
                ...req.body,
                owner: ownerEmail
            };
            await this.service.createOne(product);
            if (req.session?.user) {
                // Si hay una sesión activa, redirigir
                res.redirect(302, '/productsManager');
            } else {
                // Si no hay sesión activa, devolver una respuesta JSON
                res.status(201).json({ success: true, message: 'Producto agregado correctamente' });
            }
        } catch (err) {
            next(err);
        }
    }
    
    async deleteProductById(req, res) {
        try {
            const productId = req.params.pid
            const product = await this.service.getById(productId);
            if (!product) {
                res.status(400).json({ error: 'Producto no encontrado.' })
                return;
            }

            await this.service.deleteById(productId, product.owner)
            
            if (req.session?.user) {
                // Si hay una sesión activa, redirigir
                res.redirect(302, '/productsManager');
            } else {
                // Si no hay sesión activa, devolver una respuesta JSON
                res.status(201).json({ success: true, message: 'Producto eliminado correctamente' });
            }
        } catch (error) {
            return this.#handleError(res, error)
        }
    }
    
    async updateProduct(req, res, next) {
        try {
            const product = { ...req.body, _id: req.params.pid };
            const updatedProduct = await this.service.updateOne(product);
            res.status(200).json({ success: true, message: 'Producto actualizado correctamente', data: updatedProduct });
        } catch (error) {
            next(error); // Pasar el error al middleware de manejo de errores
        }
    }
}


module.exports = ProductController