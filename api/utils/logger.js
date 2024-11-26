const winston = require('winston');

const customLevelsOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warn: 2,
        info: 3,
        http: 4,
        debug: 5,
    },
    colors: {
        fatal: 'red',
        error: 'red',
        warn: 'yellow',
        info: 'blue',
        http: 'green',
        debug: 'green'
    }
};

winston.addColors(customLevelsOptions.colors);

const devLogger = winston.createLogger({
    levels: customLevelsOptions.levels,
    transports: [
        new winston.transports.Console({
            level: 'debug',
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        })
    ]
});

const prodLogger = winston.createLogger({
    levels: customLevelsOptions.levels,
    transports: [
        new winston.transports.Console({
            level: 'debug',
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            level: 'debug',
            filename: `${__dirname}/../logs/app.log`,
            format: winston.format.combine(
                winston.format.simple()
            )
        }),
    ]
});

const logger = process.env.NODE_ENV === 'production'
    ? prodLogger
    : devLogger;

/**
 * @type {import('express').RequestHandler}
 */
const useLogger = (req, res, next) => {
    req.logger = logger;
    req.logger.http(`Request al endpoint: ${req.url}`);
    next();
};

module.exports = { useLogger };
