document.addEventListener('DOMContentLoaded', () => {
    const productsList = document.querySelector('.card-product ul');

    productsList.addEventListener('click', (event) => {
        if (event.target.classList.contains('increment')) {
            const quantityInput = event.target.previousElementSibling;
            let currentValue = parseInt(quantityInput.value);
            const maxValue = parseInt(quantityInput.getAttribute('max'));
            if (currentValue < maxValue) {
                quantityInput.value = currentValue + 1;
            }
        }

        if (event.target.classList.contains('decrement')) {
            const quantityInput = event.target.nextElementSibling;
            let currentValue = parseInt(quantityInput.value);
            const minValue = parseInt(quantityInput.getAttribute('min'));
            if (currentValue > minValue) {
                quantityInput.value = currentValue - 1;
            }
        }

        if (event.target.classList.contains('add-to-cart')) {
            const productElement = event.target.closest('li');
            const productId = productElement.getAttribute('data-product-id');
            const cartId = productElement.getAttribute('data-cart-id');
            const quantityInput = productElement.querySelector('.quantity');
            const quantity = parseInt(quantityInput.value);

            // Hacer la solicitud POST para agregar el producto al carrito
            fetch(`/api/cart/product/${productId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    quantity: quantity,
                }),
            })
            .then(response => response.json())
            .then(data => {
                // Manejar la respuesta de la solicitud
                if (data.status === 'success') {
                    alert(`Producto agregado al carrito correctamente.`);
                } else {
                    alert(`Error al agregar el producto al carrito: ${data.message}`);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
    });
});
