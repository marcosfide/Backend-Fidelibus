// JS del lado del cliente (browser)

const socket = io()

// escuchar los msjs desde el sevidor

socket.on('saludo', (event) => {
    console.log(event);
})