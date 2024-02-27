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

- [http://localhost:8080/products](http://localhost:8080/products)
- [http://localhost:8080/products?limit=5](http://localhost:8080/products?limit=5)
- [http://localhost:8080/products/{id}](http://localhost:8080/products/{id})

### Ejemplos de Funcionalidad

- **Obtener todos los productos**: Se llamará desde el navegador a la URL [http://localhost:8080/products](http://localhost:8080/products) sin incluir ninguna query. Esto devolverá todos los 10 productos.

- **Obtener un número específico de productos**: Se llamará desde el navegador a la URL [http://localhost:8080/products?limit=5](http://localhost:8080/products?limit=5). Esto devolverá solo los primeros 5 de los 10 productos.

- **Obtener un producto por su ID**: Se llamará desde el navegador a la URL [http://localhost:8080/products/2](http://localhost:8080/products/2). Esto devolverá solo el producto con ID igual a 2.
