const User = require("../models/user.model");
const { registerUserService } = require("../services/auth.service");
const ApiError = require("../utils/apiError");
const generateJwtToken = require("../utils/token");

// Register user controller
const registerUserController = async (req, res, next) => {
   
    // Create the user and receive the JWT from the service layer.
    let {token , newUser} = await registerUserService(req.body);

    // Store JWT token in browser cookie
    // httpOnly true means frontend JavaScript cannot access this cookie
    res.cookie("JWT_TOKEN", token, {
      httpOnly: true,
    });

    // Send success response to client
    return res.status(201).json({
      message: "User registered successfully",
      user: newUser,
    });

  
};

module.exports = { registerUserController };
