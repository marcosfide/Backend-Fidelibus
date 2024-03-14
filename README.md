# Backend-Fidelibus

Este proyecto forma parte del curso de Backend de Coderhouse. Está desarrollado utilizando Node.js y Express.

## Ejecución

Para ejecutar el proyecto, asegúrate de tener Node.js instalado en tu sistema. Luego, puedes utilizar npm para instalar las dependencias y nodemon para ejecutar el servidor.

```bash
npm install
nodemon src/App.js
```

## URLs de Funcionalidad

El servidor estará corriendo en las siguientes URLs:

URLs para obtener los json de los productos:

- [http://localhost:8080/api/products](http://localhost:8080/api/products)
- [http://localhost:8080/api/products?limit=5](http://localhost:8080/api/products?limit=5)
- [http://localhost:8080/api/products/3](http://localhost:8080/api/products/3)

URLs para obtener los HTML con las tarjetas de productos:

- [http://localhost:8080/home](http://localhost:8080/home)
- [http://localhost:8080/product/3](http://localhost:8080/product/3)

URL con listado para visualizar y/o eliminar productos y formulario para agregar un nuevo producto en tiempo real (también puede ser utilizada con postman):

- [http://localhost:8080/realTimeProducts](http://localhost:8080/realTimeProducts)


### Ejemplos de Funcionalidad

- **Obtener todos los productos**: Se llamará desde el navegador a la URL [http://localhost:8080/api/products](http://localhost:8080/api/products) sin incluir ninguna query. Esto devolverá todos los productos.

- **Obtener un número específico de productos**: Se llamará desde el navegador a la URL [http://localhost:8080/api/products?limit=5](http://localhost:8080/api/products?limit=5). Esto devolverá solo los primeros 5 productos.

- **Obtener un producto por su ID**: Se llamará desde el navegador a la URL [http://localhost:8080/api/products/3](http://localhost:8080/api/products/2). Esto devolverá solo el producto con ID igual a 2.
