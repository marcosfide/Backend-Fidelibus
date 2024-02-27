const express = require('express');
const ProductManager = require('./ProductManager');

const app = express();
const productManager = new ProductManager('./src/Products.txt');

// Ruta para obtener un producto por Id
app.get('/products/:pid', async (req, res) => {
    const productId = parseInt(req.params.pid);
    if (isNaN(productId) || productId <= 0) {
        res.send({status: 'ERROR', message: 'El Id del producto debe ser un número entero positivo.'});
        return;
    }

    const product = await productManager.getProductById(productId);
    if (!product) {
        res.send({status: 'ERROR', message: 'Producto no encontrado'});
        return;
    }

    res.send(product);
});

// Ruta para obtener todos los productos o limitar la cantidad
app.get('/products', async (req, res) => {
    let limit = req.query.limit;
    let products;

    // Verifico si se proporcionó un parámetro de consulta "limit"
    if (limit !== undefined) {
        limit = parseInt(limit); // Convertir a entero
        // Verificar si el valor de "limit" es un número válido
        if (isNaN(limit) || limit <= 0) {
            res.send({status: 'ERROR', message: 'El parámetro de consulta "limit" debe ser un número entero positivo.'});
            return;
        }
        // obtengo los productos con el límite proporcionado
        const allProducts = await productManager.getProducts();
        products = allProducts.slice(0, limit);
    } else {
        // si no se proporciona "limit", traigo todos los productos
        products = await productManager.getProducts();
    }

    res.send(products);
});

app.listen(8080, () => {
    console.log('Servidor listo');
});
