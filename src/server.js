// ./src/server.js
const express = require('express');
const app = express();
const { mongoConnect } = require("./config/db");
const logger = require('./config/logger');

require("dotenv").config();


const startServer = async () => {
    try {
        app.listen(process.env.PORT, () => {
            logger.info(`Server Connection Was Successful. ${process.env.URL}`);
        });
    } catch (error) {
        logger.error(`Error In Server Connection: ${error.message}`);
        process.exit(1);
    }
}


startServer();
mongoConnect();