const { fakerES: faker } = require('@faker-js/faker');

const generateProduct = () => {
    return {
        id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        code: faker.string.uuid(),
        price: faker.commerce.price(),
        status: faker.datatype.boolean(),
        stock: faker.number.int({ min: 0, max: 100 }),
        category: faker.commerce.department(),
        thumbnail: faker.image.url()
    };
};

module.exports = { generateProduct };
