const mongoose = require("mongoose");
const SessionsStorage = require("../src/persistence/sessionsStorage");
const SessionModel = require("../src/dao/models/session.model");
const chai = import('chai');

describe('Testing sessionsStorage', () => {

    let expect;
    const sessionsStorage = new SessionsStorage();
    let connection = null;
    let req = null;

    beforeEach(function() {
        this.timeout(5000); // Configuramos el test para que mocha lo espere 5 segs

        // Mock de request con session
        req = {
            session: {
                user: null
            }
        };
    });

    afterEach(async () => {
        // Limpiamos la colección después de cada test
        await connection.db.collection('sessions').deleteMany({});
    });

    before(async () => {
        // Nos conectamos a la base de datos antes de todos los tests
        const mongooseConnection = await mongoose.connect('mongodb://localhost:27017', { dbName: 'testing' });
        connection = mongooseConnection.connection;

        // Importamos chai y asignamos expect
        const chaiModule = await chai;
        expect = chaiModule.expect;
    });

    after(async () => {
        // Nos desconectamos de la base de datos después de todos los tests
        await connection.db.dropDatabase();
        await connection.close();
    });

    it('El resultado de createSession(req, userSession) debe crear una sesión correctamente', async () => {
        let mockUserSession = {
            email: "tester1@gmail.com",
            _id: "662d217714e575fa1ee7f2e1"
        };

        await sessionsStorage.createSession(req, mockUserSession);

        expect(req.session.user).to.exist;
        expect(req.session.user.email).to.equal(mockUserSession.email);

        // Verificamos que la sesión se ha almacenado en la base de datos
        const storedSession = await SessionModel.findOne({ "session": { $regex: mockUserSession.email } });
        expect(storedSession).to.exist;
        expect(storedSession.session).to.include(mockUserSession.email);
    });

});
