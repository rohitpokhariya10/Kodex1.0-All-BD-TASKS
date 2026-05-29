const User = require("../models/user.model");
const { hashToken } = require("../utils/crypto.utils");
const { hashPassword } = require("../utils/password.util");
const { generateAccessToken, generateRefreshToken } = require("../utils/token");
const ApiError = require("../utils/apiError");
const { registerUserService } = require("../service/auth.service");

// Handles the HTTP layer for user registration and delegates business rules to the service.
const registerUserController = async (req, res) => {
  
 let {safeUser , accessToken , refreshToken }= await registerUserService(req.body);
  return res
    // Keep tokens in httpOnly cookies so client-side JavaScript cannot read them.
    .cookie("accessToken", accessToken, {
      httpOnly: true,
    })
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
    })
    .status(201)
    .json({
      sucess: true,
      message: "User registered successfully",
      // Return only non-sensitive profile fields prepared by the service layer.
      safeUser
    });
};

module.exports = { registerUserController };
