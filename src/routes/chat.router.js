const { Router } = require('express');
const router = Router();

const MessageModel = require('../dao/models/message.model');

router.get('/', (_, res) => {
    res.render('chat', {
        title: 'Aplicación de Chat',
        useWS: true,
        useSweetAlert: true,
        scripts: ['chat.js']
    });
});

// Ruta para agregar un mensaje
router.post('/', async (req, res) => {
    const { user, message } = req.body; // Obtener usuario y mensaje del cuerpo de la solicitud

    try {
        // Crear un nuevo mensaje en la base de datos
        const newMessage = await MessageModel.create({ user, message });

        // Devolver una respuesta exitosa con el mensaje creado
        res.status(201).json({ status: 'success', message: newMessage });
    } catch (error) {
        // Manejar errores si ocurren al guardar el mensaje
        console.error('Error al guardar el mensaje:', error);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});



module.exports = router;
