class LoggerController {
    startLogerTest(req, res) {
        try {
            req.logger.debug('Debug test - Relevancia: 5');
            req.logger.http('HTTP TEST - Relevancia: 4');
            req.logger.info('Info test - Relevancia: 3');
            req.logger.warn('Warning test - Relevancia: 2');
            req.logger.error('Error test - Relevancia: 1');
            req.logger.fatal('Fatal test - Relevancia: 0');

            res.status(200).json('Test de logger concluido');
        } catch (error) {
            console.error('Error en el logger test:', error);
            res.status(500).json('Error en el logger test');
        }
    }
}

module.exports = LoggerController;
