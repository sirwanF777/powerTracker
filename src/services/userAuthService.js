// ./src/services/userAuthService.js
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const apiError = require("../utils/apiError");
const logger = require("../config/logger");
require("dotenv").config();


const signup = async (userName, password) => {  
    try {
        const newUser = new userModel({userName, password});
        await newUser.save();
    
        const {token} = createToken(userID=newUser._id);
    
        logger.info(`New User Information Has Been Successfully Registered. ID: ${newUser._id}`);
        return {"message": `New User Information Has Been Successfully Registered.`, token};
    } catch (error) {
        if (error instanceof apiError) {
            throw error; 
        } else {
            throw new apiError(500, error.message);
        }
    }
}


const createToken = (userID) => {
    try {
        return jwt.sign({id: userID}, process.env.JWT_SECRET, {expiresIn: "1h"});
    } catch (error) {
        throw new apiError(500, `Token Creation Was Not Successful. Error Message: ${error.message}`);
    }
}


module.exports = {signup, }