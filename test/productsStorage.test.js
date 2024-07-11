const mongoose = require("mongoose");
const ProductsStorage = require("../src/persistence/productsStorage");
const chai = import('chai');

describe('Testing productsStorage', () => {

    let expect;

    before(async () => {
        const chaiModule = await chai;
        expect = chaiModule.expect;
    });

    const productsStorage = new ProductsStorage();
    let connection = null;

    beforeEach(function() {
        this.timeout(5000); // configuramos el test para que mocha lo espere 5 segs
    });

    afterEach(async () => {
        // Limpiamos la colección después de cada test
        await connection.db.collection('products').deleteMany({});
    });

    before(async() => {
        // Nos conectamos a la base de datos antes de todos los tests
        const mongooseConnection = await mongoose.connect('mongodb://localhost:27017', { dbName: 'testing' });
        connection = mongooseConnection.connection;
    });

    after(async() => {
        // Nos desconectamos de la base de datos después de todos los tests
        await connection.db.dropDatabase();
        await connection.close();
    });

    it('El resultado de getAll() debe ser un array', async() => {
        const result = await productsStorage.getAll();
        expect(result).to.be.an('array');
    });

    it('El resultado de createOne(product) debe agregar un producto correctamente a la base de datos', async() => {
        let mockProduct = {
            title: "Producto por mocha",
            description: "testing mocha",
            code: "2rt5jj",
            price: 100,
            status: true,
            stock: 20,
            category: "mocha",
            thumbnail: "img.jpg",
            owner: "tester5@gmail.com"
        };
        const result = await productsStorage.createOne(mockProduct);
        expect(result._id).to.be.ok
    });

    it('El resultado de getById(id) debe retornar el producto correcto', async() => {
        let mockProduct = {
            title: "Producto por mocha",
            description: "testing mocha",
            code: "2rt5jj",
            price: 100,
            status: true,
            stock: 20,
            category: "mocha",
            thumbnail: "img.jpg",
            owner: "tester5@gmail.com"
        };
        const createdProduct = await productsStorage.createOne(mockProduct);
        const result = await productsStorage.getById(createdProduct._id);
        expect(result._id).to.be.ok
    });

    it('El resultado de deleteById(id) debe eliminar el producto correctamente de la base de datos', async() => {
        let mockProduct = {
            title: "Producto por mocha",
            description: "testing mocha",
            code: "2rt5jj",
            price: 100,
            status: true,
            stock: 20,
            category: "mocha",
            thumbnail: "img.jpg",
            owner: "tester5@gmail.com"
        };
        const createdProduct = await productsStorage.createOne(mockProduct);
        await productsStorage.deleteById(createdProduct._id);
        try {
            await productsStorage.getById(createdProduct._id);
        } catch (error) {
            expect(error.message).to.equal('not found');
        }
    });

    it('El resultado de updateOne(product) debe actualizar el producto correctamente en la base de datos', async() => {
        let mockProduct = {
            title: "Producto por mocha",
            description: "testing mocha",
            code: "2rt5jj",
            price: 100,
            status: true,
            stock: 20,
            category: "mocha",
            thumbnail: "img.jpg",
            owner: "tester5@gmail.com"
        };
        const createdProduct = await productsStorage.createOne(mockProduct);
        const updatedData = {
            _id: createdProduct._id,
            title: "Producto actualizado",
            description: "testing mocha actualizado",
            price: 150
        };
        const result = await productsStorage.updateOne(updatedData);
        expect(result).to.have.property('title', updatedData.title);
        expect(result).to.have.property('description', updatedData.description);
        expect(result).to.have.property('price', updatedData.price);
    });

    it('El resultado de findByCode(code) debe retornar el producto correcto', async() => {
        let mockProduct = {
            title: "Producto por mocha",
            description: "testing mocha",
            code: "2rt5jj",
            price: 100,
            status: true,
            stock: 20,
            category: "mocha",
            thumbnail: "img.jpg",
            owner: "tester5@gmail.com"
        };
        const createdProduct = await productsStorage.createOne(mockProduct);
        const result = await productsStorage.findByCode(mockProduct.code);
        expect(result.code).to.be.equal(mockProduct.code)
    });

});
