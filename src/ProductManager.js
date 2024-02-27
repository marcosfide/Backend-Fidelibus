const fs = require('fs')

class ProductManager {
    #ultimoId = 1

    constructor(path){
        this.path = path;
        if (!fs.existsSync(path)) {
            fs.writeFileSync(path, JSON.stringify([], null, 2), 'utf-8');
        }
        this.#updateUltimoId();
    }

    async #updateUltimoId() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            const productsFile = JSON.parse(data);
            if (productsFile.length > 0) {
                const lastProduct = productsFile[productsFile.length - 1];
                this.ultimoId = lastProduct.id + 1;
            } else {
                this.ultimoId = 1;
            }
        } catch (error) {
            console.error('Error al actualizar el último ID:', error);
        }
    }

    #getNuevoId() {
        const id = this.#ultimoId;
        this.#ultimoId += 1;
        return id;
    }

    async addProduct(title, description, price, thumbnail, code, stock) {
        const textFields = title && description && thumbnail && code;
        const numberFields = price && price > 0 && stock && stock >= 0;
        const validateFields = textFields && numberFields;
    
        if (!validateFields) {
            console.log('Todos los campos son obligatorios');
            return;
        }

        try {
            const data = await fs.promises.readFile(this.path, 'utf-8')
            const productsFile = JSON.parse(data);

            const isInProducts = productsFile.some(prod => prod.code === code);
        
            if (isInProducts) {
                console.error('El código de producto ya se encuentra en products');
                return;
            }
        
            const newProduct = {
                id: this.#getNuevoId(),
                title: title,
                description: description,
                price: price,
                thumbnail: thumbnail,
                code: code,
                stock: stock
            };
        
            productsFile.push(newProduct);
        
            await fs.promises.writeFile(this.path, JSON.stringify(productsFile, null, 2), 'utf-8');
        
            return productsFile;
            
        } catch (error) {
            console.error('Error al agregar el producto:', error);            
        }
    }
    
    async getProducts(){
        const data = await fs.promises.readFile(this.path, 'utf-8')
        const productsFile = JSON.parse(data)
        console.log(productsFile);
        return productsFile
    }

    async getProductById(id){
        const data = await fs.promises.readFile(this.path, 'utf-8')
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

    async updateProduct(id, updatedFields) {
        const data = await fs.promises.readFile(this.path, 'utf-8')
        const productsFile = JSON.parse(data);
        const index = productsFile.findIndex(prod => prod.id === id);
    
        if (index === -1) {
            console.error('Producto no encontrado');
            return null;
        }
    
        const updatedProduct = { ...productsFile[index], ...updatedFields };
        productsFile[index] = updatedProduct;
        await fs.promises.writeFile(this.path, JSON.stringify(productsFile, null, 2), 'utf-8');
    
        return updatedProduct;
    }
    
    async deleteProduct(id) {
        const data = await fs.promises.readFile(this.path, 'utf-8')
        const productsFile = JSON.parse(data);
    
        const index = productsFile.findIndex(prod => prod.id === id);
    
        if (index === -1) {
            console.error('Producto no encontrado');
            return false;
        }
    
        productsFile.splice(index, 1);
    
        await fs.promises.writeFile(this.path, JSON.stringify(productsFile, null, 2), 'utf-8');
    
        return true;
    }

}




module.exports = ProductManager;
