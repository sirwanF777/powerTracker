// ./src/models/userModels.js
const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const apiError = require("../utils/apiError");


const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: [true, 'Username Is Required.'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Password Is Required.'],
    }
}, { timestamps: true });

userSchema.pre("save", async function (next) {
    try {
        const user = this;

        const existingUser = await mongoose.models.User.findOne({userName: user.userName});
        if (existingUser) {
            throw new apiError(400, "User Name Already Exists.");
        }
    
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        next();
    } catch (error) {
        if(error instanceof apiError) {
            next(error);
        } else {
            next(new apiError(500, error.message));
        }
    }
});

const userModel = mongoose.model('User', userSchema);


module.exports = userModel;