const User = require("../models/user.model");
const { hashToken } = require("../utils/crypto.utils");
const { hashPassword } = require("../utils/password.util");
const { generateAccessToken, generateRefreshToken } = require("../utils/token");
const ApiError = require("../utils/apiError");
const {
  registerUserService,
  loginUserService,
  logOutUserService,
} = require("../service/auth.service");

// Handles the HTTP layer for user registration and delegates business rules to the service.
const registerUserController = async (req, res) => {
  // Service returns sanitized user data plus tokens after completing all registration rules.
  let { safeUser, accessToken, refreshToken } = await registerUserService(
    req.body,
  );
  return (
    res
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
        safeUser,
      })
  );
};

// Handles login requests by delegating credential validation and token generation to the service.
const loginUserController = async (req, res) => {
  // Service returns a safe user object; raw password and token hashes stay out of the response.
  let { user, accessToken, refreshToken } = await loginUserService(req.body);
  console.log("loggedIn user-->", user);
  // Store tokens in httpOnly cookies to reduce exposure to browser-side script access.
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
  });
  return res
    .status(200)
    .json({ message: `${user.name} loggedIn successfully`, user });
};

const logOutUserController = async (req, res) => {
  await logOutUserService(req.cookies);
  res.cookie("accessToken", { httpOnly: true });
  res.cookie("refreshToken", { httpOnly: true });
  return res.status(200).json({
    message: "User logout successfully",
  });
};
module.exports = {
  registerUserController,
  loginUserController,
  logOutUserController,
};
