// config/logger.js
const winston = require('winston');
require("dotenv").config();


const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ 
            filename: process.env.ERROR_LOG_PATH || './src/logs/error.log',
            level: 'error' 
        }),
        new winston.transports.File({ 
            filename: process.env.INFO_LOG_PATH || './src/logs/info.log',
            level: 'info' 
        }),
        new winston.transports.File({
            filename: process.env.REQUEST_LOG_PATH || `./src/logs/request.log`,
            level: 'http'
        })
    ]
});


module.exports = logger;