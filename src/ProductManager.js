const fs = require('fs');

class ProductManager {
    #ultimoProductId = 1;
    #ultimoCartId = 1;
    #deletedProductIds = new Set();

    constructor(productPath) {
        this.productPath = productPath;
        this.cartPath = this.createCartsFile();
        if (!fs.existsSync(productPath)) {
            fs.writeFileSync(productPath, JSON.stringify([], null, 2), 'utf-8');
        }
    }

    async addProduct({ title, description, code, price, status = true, stock, category, thumbnail = []}) {
        const requiredFields = title && description && code && price && status && stock && category;
        const textFields = typeof title === 'string' && typeof description === 'string' && typeof code === 'string' && typeof category === 'string';
        const numberFields = typeof price === 'number' && price > 0 && typeof stock === 'number' && stock >= 0;
        const statusField = typeof status === 'boolean';
        const validateFields = requiredFields && textFields && numberFields && statusField;
    
        if (!validateFields) {
            console.log('Faltan campos obligatorios o algunos campos no tienen el formato correcto');
            return;
        }
    
        try {
            const productPath = await this.productPath;
            const data = await fs.promises.readFile(productPath, 'utf-8');
            const productsFile = JSON.parse(data);
    
            let newId = this.generateUniqueId(productsFile);
    
            const isInProducts = productsFile.some(prod => prod.code === code);
    
            if (isInProducts) {
                console.error('El código de producto ya se encuentra en products');
                return;
            }
    
            const newProduct = {
                id: newId,
                title,
                description,
                code,
                price,
                status,
                stock,
                category,
                thumbnail: thumbnail
            };
    
            productsFile.push(newProduct);
    
            await fs.promises.writeFile(productPath, JSON.stringify(productsFile, null, 2), 'utf-8');
    
            return productsFile;
    
        } catch (error) {
            console.error('Error al agregar el producto:', error);
        }
    }
    
    generateUniqueId(products) {
        let newId = this.#ultimoProductId;
        while (products.some(prod => prod.id === newId) || this.#deletedProductIds.has(newId)) {
            newId++;
        }
        this.#ultimoProductId = newId + 1;
        return newId;
    }
    
    async getProducts(){
        const productPath = await this.productPath;
        const data = await fs.promises.readFile(productPath, 'utf-8');
        const productsFile = JSON.parse(data)
        return productsFile
    }

    async getProductById(id){
        const productPath = await this.productPath;
        const data = await fs.promises.readFile(productPath, 'utf-8');
        const productsFile = JSON.parse(data)

        const product = productsFile.find(prod => prod.id === id)

        if (product) { 
            console.log(product);
            return product  
        } else{
            console.error('Not found');
            return null
        }
    }

    async updateProduct([id, updatedFields]) {
        const productPath = await this.productPath;
        const data = await fs.promises.readFile(productPath, 'utf-8');
        const productsFile = JSON.parse(data);
        const index = productsFile.findIndex(prod => prod.id === id);
    
        if (index === -1) {
            console.error('Producto no encontrado');
            return null;
        }
    
        const updatedProduct = { ...productsFile[index], ...updatedFields };
        productsFile[index] = updatedProduct;
        await fs.promises.writeFile(productPath, JSON.stringify(productsFile, null, 2), 'utf-8');
    
        return updatedProduct;
    }
    
    async deleteProduct(id) {
        const productPath = await this.productPath;
        const data = await fs.promises.readFile(productPath, 'utf-8');
        const productsFile = JSON.parse(data);
    
        const index = productsFile.findIndex(prod => prod.id === id);
    
        if (index === -1) {
            console.error('Producto no encontrado');
            return false;
        }
    
        productsFile.splice(index, 1);
        this.#deletedProductIds.add(id); // Añadir el ID eliminado a la lista de IDs eliminados
    
        await fs.promises.writeFile(productPath, JSON.stringify(productsFile, null, 2), 'utf-8');
    
        return true;
    }


    async createCartsFile() {
        const cartPath = './src/carritos.json';
        if (!fs.existsSync(cartPath)) {
            fs.writeFileSync(cartPath, JSON.stringify([], null, 2), 'utf-8');
        }
        return cartPath;
    }

    async addCart(cartProducts) {
        try {
            const cartPath = await this.cartPath;
            const data = await fs.promises.readFile(cartPath, 'utf-8');
            const cartsFile = JSON.parse(data);
    
            let newCartId = this.generateUniqueCartId(cartsFile);
    
            const newCart = {
                id: newCartId,
                products: cartProducts ? cartProducts : []
            };
    
            cartsFile.push(newCart);
    
            await fs.promises.writeFile(cartPath, JSON.stringify(cartsFile, null, 2), 'utf-8');
    
            return newCart;
    
        } catch (error) {
            console.error('Error al agregar el carrito:', error);
        }
    }    

    generateUniqueCartId(carts) {
        let newCartId = this.#ultimoCartId;
        while (carts.some(cart => cart.id === newCartId)) {
            newCartId++;
        }
        this.#ultimoCartId = newCartId + 1;
        return newCartId;
    }

    async getCartById(id){
        const cartPath = await this.cartPath;
        const data = await fs.promises.readFile(cartPath, 'utf-8');
        const cartsFile = JSON.parse(data)

        const cart = cartsFile.find(c => c.id === id)

        if (cart) { 
            console.log(cart);
            return cart  
        } else{
            console.error('Not found');
            return null
        }
    }

    async updateCart(cartId, updatedCart) {
        try {
            const cartPath = await this.cartPath;
            const data = await fs.promises.readFile(cartPath, 'utf-8');
            const cartsFile = JSON.parse(data);
    
            const index = cartsFile.findIndex(cart => cart.id === cartId);
            if (index === -1) {
                console.error('Carrito no encontrado');
                return null;
            }
    
            cartsFile[index] = updatedCart;
    
            await fs.promises.writeFile(cartPath, JSON.stringify(cartsFile, null, 2), 'utf-8');
    
            return updatedCart;
        } catch (error) {
            console.error('Error al actualizar el carrito:', error);
            throw error;
        }
    }
    

}



// const main = async () => {
//     const manager = new ProductManager('./src/Products.txt');

//     await manager.updateProduct([
//         15,
//         {
//           "title": "asdaapor postman",
//           "description": "asdfasman",
//           "price": 22200,
//         }

//     ]);
// };

// main();

module.exports = ProductManager;
