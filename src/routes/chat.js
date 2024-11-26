const Router = require('./router')
const MessageModel = require('../dao/models/message.model');

class ChatRouter extends Router {
    init() {

        this.get('/', (_, res) => {
            res.render('chat', {
                title: 'Aplicación de Chat',
                useWS: true,
                useSweetAlert: true,
                scripts: ['chat.js']
            });
        });

        // Ruta para agregar un mensaje
        this.post('/', async (req, res) => {
            const { user, message } = req.body;
            console.log('POST /chat - Received:', req.body); // <-- Agregar log
            try {
                const newMessage = await MessageModel.create({ user, message });
                console.log('POST /chat - Saved:', newMessage); // <-- Agregar log
                res.status(201).json({ status: 'success', message: newMessage });
            } catch (error) {
                console.error('Error al guardar el mensaje:', error);
                res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
            }
        });
        

    }
}

module.exports = ChatRouter