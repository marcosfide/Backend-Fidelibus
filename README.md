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

### URLs /api/products

URLs api/products para metodos GET:

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


### URLs /api/carts

#### URLs api/carts para metodos GET:

URLs api/carts para obtener el json de los carritos:
- [http://localhost:8080/api/carts](http://localhost:8080/api/carts)

URLs api/carts/:cid para obtener el json del carrito por id:
- [http://localhost:8080/api/carts/661d5cb4983b6ec699ef4856](http://localhost:8080/api/carts/661d5cb4983b6ec699ef4856)


#### URLs api/carts para utilizar los metodos post, put y delete(desde postman):

METODOS POST:
- Ruta para crear un nuevo carrito utilizando el metodo POST, con postman:
 [http://localhost:8080/api/carts](http://localhost:8080/api/carts)

- Ruta para agregar el producto al arreglo products del carrito seleccionado por id, utilizando el metodo POST por postman:
 [http://localhost:8080/api/carts/660b577741af3e1a719e364c/product/6606ce83e69eb87a91d699dd](http://localhost:8080/api/carts/660b577741af3e1a719e364c/product/6606ce83e69eb87a91d699dd)

METODOS PUT:
- Ruta para actualizar los productos de un carrito, pasando el id del cart como parametro y el array con objetos que contengan array de products, quantity, y _id, por body, utilizando el metodo PUT por postman:
 [http://localhost:8080/api/carts/660b577741af3e1a719e364c/product/6606ce83e69eb87a91d699dd](http://localhost:8080/api/carts/660b577741af3e1a719e364c/product/6606ce83e69eb87a91d699dd)

- Ruta para actualizar la cantidad de productos del prod id corerspondiente al cart id pasados por parametros con la quantity pasado por body en un json { "quantity" : x }, utilizando el metodo PUT por postman:
 [http://localhost:8080/api/carts/661d5cb4983b6ec699ef4856/products/6606ce83e69eb87a91d699da](http://localhost:8080/api/carts/661d5cb4983b6ec699ef4856/products/6606ce83e69eb87a91d699da)

METODOS DELETE:
- Ruta para eliminar un producto por id correspondiente al carrito seleccionado por id, utilizando el metodo DELETE por postman:
 [http://localhost:8080/api/carts/661d5cb4983b6ec699ef4856/products/6606ce83e69eb87a91d699e3](http://localhost:8080/api/carts/661d5cb4983b6ec699ef4856/products/6606ce83e69eb87a91d699e3)

- Ruta para eliminar todos los productos del carrito seleccionado por id, utilizando el metodo DELETE por postman:
 [http://localhost:8080/api/carts/660b577741af3e1a719e364c](http://localhost:8080/api/carts/660b577741af3e1a719e364c)



### URLs para las vistas /

URLs para obtener los HTML con las tarjetas de productos:


URLs/products para obtener el json del pagination de los productos:
- [http://localhost:8080/products](http://localhost:8080/products)

URLs/products?limit=x para filtrar los productos por cantidad:
- [http://localhost:8080/products?limit=5](http://localhost:8080/products?limit=5)

URLs/products/id para filtrar por id de producto:
- [http://localhost:8080/products/6606ce83e69eb87a91d699df](http://localhost:8080/products/6606ce83e69eb87a91d699df)

URLs/products?category=categoría para filtrar por categoría:
- [http://localhost:8080/products?category=mates](http://localhost:8080/products?category=mates)

URLs/products=availability=s/n para filtrar por disponibilidad de stock:
- [http://localhost:8080/products?availability=s](http://localhost:8080/products?availability=s)
- [http://localhost:8080/products?availability=n](http://localhost:8080/products?availability=n)

URLs/products?sort=asc/desc para ordenar por precio:
- [http://localhost:8080/products?sort=asc](http://localhost:8080/products?sort=asc)
- [http://localhost:8080/products?sort=desc](http://localhost:8080/products?sort=desc)

URLs/products?page=x para buscar por página:
- [http://localhost:8080/products?page=2](http://localhost:8080/products?page=2)

 Ruta para obtener el renderizado de un producto especifico por id pasado por parametro
- [http://localhost:8080/product/6606ce83e69eb87a91d699da](http://localhost:8080/product/6606ce83e69eb87a91d699da)


Renderizado de Cart por id
 Ruta con los productos de un carrito seleccionado por id pasado por parametro:
- [http://localhost:8080/carts/661d5cb4983b6ec699ef4856](http://localhost:8080/carts/661d5cb4983b6ec699ef4856)



-----
-----



URL con listado para visualizar y/o eliminar productos y formulario para agregar un nuevo producto (también puede ser utilizada con postman):

- [http://localhost:8080/realTimeProducts](http://localhost:8080/realTimeProducts)



### URL para acceder a la App de chat:
- [http://localhost:8080/chat](http://localhost:8080/chat)




## Dependencias
A continuación se detallan las dependencias utilizadas en este proyecto:

- **Express**: Framework web rápido y minimalista para Node.js.
- **Express Handlebars**: Módulo de Handlebars para Express que proporciona renderizado de plantillas HTML.
- **Method-Override**: Middleware de Express que permite usar métodos HTTP como PUT o DELETE en formularios HTML.
- **Mongoose**: Herramienta de modelado de objetos MongoDB para Node.js.
- **Socket.io**: Biblioteca que habilita comunicación en tiempo real entre clientes y servidores web.

## Autor
**Marcos Fidelibus**