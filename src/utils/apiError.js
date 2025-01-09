// ./src/utils/apiError.js
const logger = require('../config/logger');


class apiError extends Error {
    constructor(statusCode, message, details = null) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;

        logger.error({
            statusCode,
            message,
            details,
            timestamp: new Date().toISOString()
        });

        Error.captureStackTrace(this, this.constructor);
    }
}


module.exports = apiError;
