// ./src/config/db.js
const mongoose = require('mongoose');
const logger = require('../config/logger');

require("dotenv").config();


const mongoConnect = async () => {
    try {
        mongoose.connect(process.env.MONGO_DB_URL);
        logger.info(`MongoDB Connection Was Successfull.`);
    } catch (error) {
        logger.error("MongoDB Connection Was Not Successful.");
        console.log(`${error.message}`);
    }
}


module.exports = {mongoConnect};