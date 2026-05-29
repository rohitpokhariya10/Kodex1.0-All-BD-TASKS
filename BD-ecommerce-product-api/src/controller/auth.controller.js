const User = require("../models/user.model");
const { hashToken } = require("../utils/crypto.utils");
const { hashPassword } = require("../utils/password.util");
const { generateAccessToken, generateRefreshToken } = require("../utils/token");
const ApiError = require("../utils/apiError");
const { registerUserService } = require("../service/auth.service");

const registerUserController = async (req, res) => {
  
 let {safeUser , accessToken , refreshToken }= await registerUserService(req.body);
  return res
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
      safeUser
    });
};

module.exports = { registerUserController };
