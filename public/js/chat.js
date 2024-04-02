// JS del lado del cliente (browser)

const socket = io()

let username;
const chatBox = document.getElementById('chatBox')
const messageLogs = document.getElementById('messageLogs')

// Bloquear pantalla del usuario y pedirle un username
Swal.fire({
    title: 'Ingrese nombre de usuario',
    input: 'text',
    text: 'Debes identificarte',
    icon: 'success',
    inputValidator: (value) => {
        return !value && 'Debes ingresar un nombre de usuario'
    },
    allowOutsideClick: false
}).then(result => {
    username = result.value;
    console.log(`Usuario identificado como: ${username}`);

    // Notificamos que se conectó
    socket.emit('user-connected', username);
});

// Función para enviar mensajes al servidor
function sendMessageToServer(message) {
    fetch('/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user: username,
            message: message
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Message sent successfully:', data);
    })
    .catch(error => {
        console.error('Error sending message:', error);
    });
}

// Escuchar el evento enter y enviar el mensaje al chat
chatBox.addEventListener('keyup', event => {
    if (event.key === 'Enter') {
        const text = chatBox.value;
        if (text.trim().length > 0) {
            sendMessageToServer(text);
            socket.emit('message', { username, text });
            chatBox.value = '';
        }
    }
});

// Escuchar los mensajes desde el servidor y mostrarlos
socket.on('message', (data) => {
    const { username, text } = data;
    messageLogs.innerHTML += `${username}: ${text} </br>`;
});

socket.on('user-joined-chat', (username) => {
    swal.fire({
        text: `Nuevo usuario conectado: ${username}`,
        toast: true,
        position: 'top-right',
    });
});
