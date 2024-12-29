// ./src/services/userAuthService.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const apiError = require("../utils/apiError");
const logger = require("../config/logger");


const signup = async (userName, password, email) => {  
    try {
        const newUser = new userModel({ userName, password, email });
        await newUser.save();
    
        const token = await createTokenByName(userName=newUser.userName);

        logger.info(`New User Information Has Been Successfully Registered. ID: ${newUser._id}`);
        return {"message": `New User Information Has Been Successfully Registered.`, token, user: newUser};
    } catch (error) {
        if (error instanceof apiError) {
            throw error; 
        } else {
            throw new apiError(500, error.message);
        }
    }
}

const login = async (userName, password) => {
    try {
        const user = await userModel.findOne({ userName });
        if(user){
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return { "message": "Password Is Incorrect." }
                // throw new apiError(401, "Password Is Incorrect.");
            }

            const token = await createTokenByName(userName=user.userName);
            
            logger.info(`User Login Was Successful. userName: ${user.userName}, ID: ${user._id}`);

            return { "message": `User Login Was Successful. Name: ${userName}`, token, user }
        } else {
            return {"message": `Use Name Is Incorrect.`}
        }
    } catch (error) {
        throw (error instanceof apiError ? error : new apiError(500, error.message)); 
    }
}


const createTokenByName = (userName) => {
    try {
        return jwt.sign({ userName }, process.env.JWT_SECRET, {expiresIn: "1h"});
    } catch (error) {
        throw new apiError(500, `Token Creation Was Not Successful. Error Message: ${error.message}`);
    }
}

const createTokenByID = (userID) => {
    try {
        return jwt.sign({id: userID}, process.env.JWT_SECRET, {expiresIn: "1h"});
    } catch (error) {
        throw new apiError(500, `Token Creation Was Not Successful. Error Message: ${error.message}`);
    }
}


module.exports = {
    signup,
    login,
}