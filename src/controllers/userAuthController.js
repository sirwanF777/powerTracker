// ./src/controllers/userController.js
const userAuthService = require("../services/userAuthService");
const apiError = require("../utils/apiError");


/**
 * Handles user registration.
 * Extracts user information from the request body, registers the user using the service layer, 
 * and sets a secure JWT token in the response cookies.
 * @param {Object} req - The HTTP request object containing user registration data.
 * @param {Object} res - The HTTP response object for sending back the registration result.
 * @param {Function} next - Middleware function for error handling.
 */
const signup = async (req, res, next) => {
    try {
        const { userName, password, email } = req.body;
        const { message, token, user } = await userAuthService.signup(userName, password, email);

        res.cookie('jwt', token, {
            httpOnly: true, // Protect cookie from being accessed by JavaScript
            secure: process.env.JWT_SECRET === 'production', // Use secure cookie in production
            sameSite: 'strict', // Prevent cross-site cookie requests
            maxAge: 3600000, // Token expiration time in milliseconds
        });

        return res.status(200).json({
            message,
            userName: user.userName,
            email: user.email,
        });
    } catch (error) {
        next(error instanceof apiError ? error : new apiError(500, error.message));
    }
};

/**
 * Handles user login.
 * Verifies user credentials through the service layer and sets a secure JWT token in the response cookies.
 * @param {Object} req - The HTTP request object containing user login data.
 * @param {Object} res - The HTTP response object for sending back the login result.
 * @param {Function} next - Middleware function for error handling.
 */
const login = async (req, res, next) => {
    try {
        const { userName, password } = req.body;
        const { message, token, user } = await userAuthService.login(userName, password);
        if (token) {
            res.cookie("jwt", token, {
                httpOnly: true, // Protect cookie from being accessed by JavaScript
                secure: process.env.JWT_SECRET === 'production', // Use secure cookie in production
                sameSite: 'strict', // Prevent cross-site cookie requests
                maxAge: 3600000, // Token expiration time in milliseconds
            });

            return res.status(200).json({
                message,
                userName: user.userName,
            });
        } else {
            return res.status(401).json({ message }); // Unauthorized access if no token is provided
        }
    } catch (error) {
        next(error instanceof apiError ? error : new apiError(500, error.message));
    }
};

/**
 * Handles user logout.
 * Clears the JWT cookie from the client and resets the request body.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object for sending back the logout confirmation.
 * @param {Function} next - Middleware function for error handling.
 */
const logout = async (req, res, next) => {
    try {
        res.clearCookie("jwt"); // Clear the JWT token from the client
        req.body = {}; // Reset the request body
        res.status(200).json({ message: "Logged Out Successfully." });
    } catch (error) {
        next(error instanceof apiError ? error : new apiError(500, error.message));
    }
};


module.exports = {
    signup,
    login,
    logout,
};
