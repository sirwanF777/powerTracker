// ./src/middleware/errorHandling.js
const apiError = require('../utils/apiError');


const errorHandler = (err, req, res, next) => {
    if (err instanceof apiError) {
        return res.status(err.statusCode).json({ message: err.message });
    }

    return res.status(500).json({ message: 'Internal Server Error.' });
};


module.exports = errorHandler;
