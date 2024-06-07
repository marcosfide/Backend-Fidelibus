/** 
 * @type {import("express").ErrorRequestHandler}
 */

const { ErrorCodes } = require("./errorCodes");

const errorHandler = (error, req, res, next) => {

    switch(error.code){
        case ErrorCodes.INVALID_TYPES_ERROR:
            res.status(400).send({status: 'error', error: error.name, cause: error.cause})
            break
        case ErrorCodes.DATABASE_ERROR:
            res.status(400).send({status: 'error', error: error.name, cause: error.cause})
            break
        default:
            res.status(500).send({ status: 'error', error: 'Unknown'})
    }

    next()
}

module.exports = { errorHandler }