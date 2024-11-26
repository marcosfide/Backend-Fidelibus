const mongoose = require('mongoose');

const SessionModel = require('../dao/models/session.model');

class SessionsStorage {

    constructor() {}

    async createSession(req, userSession) {
        // Crear nueva sesión en req.session
        req.session.user = userSession;

        // Crear nueva sesión en MongoDB
        const sessionData = {
            _id: new mongoose.Types.ObjectId().toString(),
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // Expira en 24 horas
            session: JSON.stringify(req.session)
        };

        const session = new SessionModel(sessionData);
        await session.save();
    }
}

module.exports = SessionsStorage;
