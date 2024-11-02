// ./src/utils/apiError.js
const logger = require('../config/logger');


class apiError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;

        logger.error(`StatusCode: ${statusCode}, Message: ${message}`);

        Error.captureStackTrace(this, this.constructor);
    }
}


module.exports = apiError;
