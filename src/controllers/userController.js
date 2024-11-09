// ./src/controllers/userController.js
const userAuthService = require("../services/userAuthService");
const apiError = require("../utils/apiError");


const signup = async (req, res, next) => {
    try {
        const {userName, password} = req.body;
        const {message, token} = await userAuthService.signup(userName, password);

        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.JWT_SECRET === 'production',
            maxAge: 3600000,
        });

        return res.status(200).json({message});
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
        const { message, token } = await userAuthService.login(userName, password);
        if(token){
            res.cookie("jwt", token, {
                httpOnly: true,
                secure: process.env.JWT_SECRET === 'production',
                maxAge: 3600000
            });

            return res.status(200).json({message})
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