# Backend-Fidelibus

Este proyecto forma parte del curso de Backend de Coderhouse. Está desarrollado utilizando Node.js y Express.

## Ejecución

Para ejecutar el proyecto, asegúrate de tener Node.js instalado en tu sistema. Luego, puedes utilizar npm para instalar las dependencias y nodemon para ejecutar el servidor.

```bash
npm install
nodemon src/App.js
```
Asegúrate también de tener MongoDB instalado en tu sistema. Puedes descargarlo desde el sitio web oficial de MongoDB e instalarlo siguiendo las instrucciones proporcionadas.

Si no tienes Express instalado a nivel global o si no está incluido en las dependencias del proyecto, puedes instalarlo utilizando npm:

```bash
npm install express
```

Además, si no tienes Socket.IO instalado a nivel global o si no está incluido en las dependencias del proyecto, puedes instalarlo utilizando npm:


```bash
npm install socket.io
```

## URLs de Funcionalidad

El servidor estará corriendo en las siguientes URLs:

URLs api/products para obtener el json del pagination de los productos:
- [http://localhost:8080/api/products](http://localhost:8080/api/products)

URLs api/products?limit=x para filtrar los productos por cantidad:
- [http://localhost:8080/api/products?limit=5](http://localhost:8080/api/products?limit=5)

URLs api/products/id para filtrar por id de producto:
- [http://localhost:8080/api/products/6606ce83e69eb87a91d699df](http://localhost:8080/api/products/6606ce83e69eb87a91d699df)

URLs api/products?category=categoría para filtrar por categoría:
- [http://localhost:8080/api/products?category=mates](http://localhost:8080/api/products?category=mates)

URLs api/products=availability=s/n para filtrar por disponibilidad de stock:
- [http://localhost:8080/api/products?availability=s](http://localhost:8080/api/products?availability=s)
- [http://localhost:8080/api/products?availability=n](http://localhost:8080/api/products?availability=n)

URLs api/products?sort=asc/desc para ordenar por precio:
- [http://localhost:8080/api/products?sort=asc](http://localhost:8080/api/products?sort=asc)
- [http://localhost:8080/api/products?sort=desc](http://localhost:8080/api/products?sort=desc)

URLs api/products?page=x para buscar por página:
- [http://localhost:8080/api/products?page=2](http://localhost:8080/api/products?page=2)


URLs api/products para utilizar los metodos post, put y delete(desde postman):

- Metodo POST para agregar producto(pasando los campos del producto por body): - [http://localhost:8080/api/products]
- Metodo PUT para modificar un producto(pasando el id como parametro y los campos a modificar con sus respectivos valores por body): - [http://localhost:8080/api/products/661f0a279347e792679225a3]
- Metodo DELETE para eliminar un producto(pasando el id del producto a eliminar como parametro): - [http://localhost:8080/api/products/661f0bd447d15e916fb80437]


URLs para obtener los HTML con las tarjetas de productos:

- [http://localhost:8080/home](http://localhost:8080/home)
- [http://localhost:8080/product/6606ce83e69eb87a91d699df](http://localhost:8080/product/6606ce83e69eb87a91d699df)

URL con listado para visualizar y/o eliminar productos y formulario para agregar un nuevo producto (también puede ser utilizada con postman):

- [http://localhost:8080/realTimeProducts](http://localhost:8080/realTimeProducts)


URLs api/carts para el manejo de los carritos:
- Ruta para obtener los productos del carrito por id:
 [http://localhost:8080/api/carts/660b577541af3e1a719e364a](http://localhost:8080/api/carts/660b577541af3e1a719e364a)
- Ruta para crear un nuevo carrito utilizando el metodo POST, con postman:
 [http://localhost:8080/api/carts](http://localhost:8080/api/carts)
- Ruta para agregar el producto al arreglo products del carrito seleccionado por id, utilizando el metodo POST por postman:
 [http://localhost:8080/api/carts/660b577541af3e1a719e364a/product/66081255e1ba81083e0a405a](http://localhost:8080/api/carts/660b577541af3e1a719e364a/product/66081255e1ba81083e0a405a)


URL para acceder a la App de chat:
- [http://localhost:8080/chat](http://localhost:8080/chat)




### Ejemplos de Funcionalidad

- **Obtener todos los productos**: Se llamará desde el navegador a la URL [http://localhost:8080/api/products](http://localhost:8080/api/products) sin incluir ninguna query. Esto devolverá todos los productos.

- **Obtener un número específico de productos**: Se llamará desde el navegador a la URL [http://localhost:8080/api/products?limit=5](http://localhost:8080/api/products?limit=5). Esto devolverá solo los primeros 5 productos.

- **Obtener un producto por su ID**: Se llamará desde el navegador a la URL [http://localhost:8080/api/products/3](http://localhost:8080/api/products/2). Esto devolverá solo el producto con ID igual a 2.


## Dependencias
A continuación se detallan las dependencias utilizadas en este proyecto:

- **Express**: Framework web rápido y minimalista para Node.js.
- **Express Handlebars**: Módulo de Handlebars para Express que proporciona renderizado de plantillas HTML.
- **Method-Override**: Middleware de Express que permite usar métodos HTTP como PUT o DELETE en formularios HTML.
- **Mongoose**: Herramienta de modelado de objetos MongoDB para Node.js.
- **Socket.io**: Biblioteca que habilita comunicación en tiempo real entre clientes y servidores web.

## Autor
**Marcos Fidelibus**