const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');
const express = require('express');

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)


app.listen(8080, () => {
    console.log('Servidor listo');
});
