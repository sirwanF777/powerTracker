// ./src/controllers/userController.js
const userAuthService = require("../services/userAuthService");
const apiError = require("../utils/apiError");


const signup = async (req, res, next) => {
    try {
        const {userName, password, email } = req.body;
        const {message, token, user} = await userAuthService.signup(userName, password, email);

        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.JWT_SECRET === 'production',
            sameSite: 'strict',
            maxAge: 3600000,
        });

        return res.status(200).json({
            message,
            userName: user.userName,
            email: user.email,
        });
    } catch (error) {
        if(error instanceof apiError) {
            next(error);
        } else {
            next(new apiError(500, error.message));
        }
    }
}

const login = async (req, res, next) => {
    try {
        const { userName, password } = req.body;
        const { message, token, user } = await userAuthService.login(userName, password);
        if(token){
            res.cookie("jwt", token, {
                httpOnly: true,
                secure: process.env.JWT_SECRET === 'production',
                sameSite: 'strict',
                maxAge: 3600000
            });

            return res.status(200).json({
                message,
                userName: user.userName,
            });
        } else {
            return res.status(401).json({ message });
        }
    } catch (error) {
        next(error instanceof apiError ? error : new apiError(500, error.message));
    }
}

const logout = async (req, res, next) => {
    try {
        res.clearCookie("jwt");
        req.body = {};
        res.status(200).json({ message: "Logged Out Successfully." });
    } catch (error) {
        next(error instanceof apiError ? error : new apiError(500, error.message));
    }
}


module.exports = {
    signup,
    login,
    logout,
}