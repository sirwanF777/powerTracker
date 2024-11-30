// ./src/middleware/errorHandling.js
const apiError = require('../utils/apiError');


const errorHandler = async (error, req, res, next) => {
    if (error instanceof apiError) {
        return res.status(error.statusCode).json({ message: error.details[0].message });
    }
    return res.status(500).json({ message: 'Internal Server Error.' });
};


module.exports = errorHandler;
