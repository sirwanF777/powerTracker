// ./src/services/userAuthService.js
const jwt = require("jsonwebtoken"); // For creating and verifying JWT tokens
const bcrypt = require("bcrypt"); // For hashing and comparing passwords
const userModel = require("../models/userModel"); // User model for interacting with the database
const apiError = require("../utils/apiError"); // Custom error handling class
const logger = require("../config/logger"); // Logger for tracking operations and errors


/**
 * Handles user registration.
 * @param {string} userName - The username of the new user.
 * @param {string} password - The password of the new user.
 * @param {string} email - The email of the new user.
 * @returns {Object} - Response containing a success message, token, and user information.
 */
const signup = async (userName, password, email) => {  
    try {
        const newUser = new userModel({ userName, password, email });
        await newUser.save();

        const token = await createTokenByName(userName=newUser.userName);

        logger.info(`New User Information Has Been Successfully Registered. ID: ${newUser._id}`);

        return { 
            "message": `New User Information Has Been Successfully Registered.`, 
            token, 
            user: newUser 
        };
    } catch (error) {
        if (error instanceof apiError) {
            throw error; 
        } else {
            throw new apiError(500, error.message);
        }
    }
}

/**
 * Handles user login.
 * @param {string} userName - The username provided by the user.
 * @param {string} password - The password provided by the user.
 * @returns {Object} - Response containing a success message, token, and user information.
 */
const login = async (userName, password) => {
    try {
        const user = await userModel.findOne({ userName });

        if(user){
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return { "message": "Password Is Incorrect." };
            }

            const token = await createTokenByName(userName=user.userName);

            logger.info(`User Login Was Successful. userName: ${user.userName}, ID: ${user._id}`);

            return { 
                "message": `User Login Was Successful. Name: ${userName}`, 
                token, 
                user 
            };
        } else {
            return {"message": `User Name Is Incorrect.`};
        }
    } catch (error) {
        throw (error instanceof apiError ? error : new apiError(500, error.message)); 
    }
}

/**
 * Generates a JWT token using the username.
 * @param {string} userName - The username for which the token is created.
 * @returns {string} - The generated JWT token.
 */
const createTokenByName = (userName) => {
    try {
        return jwt.sign({ userName }, process.env.JWT_SECRET, {expiresIn: "1h"}); // Token expires in 1 hour
    } catch (error) {
        throw new apiError(500, `Token Creation Was Not Successful. Error Message: ${error.message}`);
    }
}

/**
 * Generates a JWT token using the user ID.
 * @param {string} userID - The user ID for which the token is created.
 * @returns {string} - The generated JWT token.
 */
const createTokenByID = (userID) => {
    try {
        return jwt.sign({id: userID}, process.env.JWT_SECRET, {expiresIn: "1h"}); // Token expires in 1 hour
    } catch (error) {
        throw new apiError(500, `Token Creation Was Not Successful. Error Message: ${error.message}`);
    }
}

module.exports = {
    signup,
    login,
}
