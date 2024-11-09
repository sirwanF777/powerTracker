// ./src/config/db.js
const mongoose = require('mongoose');
const logger = require('../config/logger');

require("dotenv").config();


const mongoConnect = async () => {
    try {
        mongoose.connect(process.env.MONGO_DB_URL);
        logger.info(`MongoDB Connection Was Successfull. MongoDB URL: ${process.env.MONGO_DB_URL}`);
    } catch (error) {
        logger.error(`MongoDB Connection Was Not Successful. URL: ${process.env.MONGO_DB_URL}`);
    }
}


module.exports = {mongoConnect};