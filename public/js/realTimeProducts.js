const socket = io();

//BROWSER
socket.on('newProduct', (product) => {
    console.log('agregando prod');
    //agregar el nuevo prod al html
    const container = document.getElementById('productsFeed')

    container.innerHTML += `
    <tr>
        <td> ${product.title}</td>
        <td> ${product.description}</td>
        <td> ${product.price}</td>
        <td> ${product.stock}</td>
        <td> ${product.thumbnail}</td>
        <td> ${product.code}</td>
    </tr>`
})


socket.on('productDeleted', (product) => {
    console.log('Eliminando producto', product);
    const tableRow = document.querySelector(`#productsFeed tr[data-product-id="${product.id}"]`);
    if (tableRow) {
        tableRow.remove(); // Eliminar la fila del producto eliminado
    }
});
