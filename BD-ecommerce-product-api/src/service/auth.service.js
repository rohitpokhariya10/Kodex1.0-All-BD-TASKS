const User = require("../models/user.model");
const ApiError = require("../utils/apiError");
const { hashToken } = require("../utils/crypto.utils");
const { hashPassword } = require("../utils/password.util");
const { generateAccessToken, generateRefreshToken } = require("../utils/token");


//
const registerUserService = async ({ name, email, password }) => {
  if (!name?.trim()) {
    throw new ApiError(400, "Name is required");
  }

  if (!email?.trim()) {
    throw new ApiError(400, "Email is required");
  }

  if (!password?.trim()) {
    throw new ApiError(400, "Password is required");
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (!name) {
    throw new ApiError(400, "All fields are required");
  }
  let existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    throw new ApiError(409, "User already exists with this email");
  }

  const hashedPassword = await hashPassword(password);

  let user = await User.create({
    email: normalizedEmail,
    password: hashedPassword,
    name,
    isEmailVerified: true,
  });
  //console.log("user-->", user);
  let accessToken = generateAccessToken(user._id);
  let refreshToken = generateRefreshToken(user._id);

  let hashRefreshToken = hashToken(refreshToken);

  user.refreshTokenHash = hashRefreshToken;
  await user.save();

  const safeUser = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    authProvider: user.authProvider,
    isEmailVerified: user.isEmailVerified,
    avatar: user.avatar,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  return {safeUser , accessToken , refreshToken};
};
module.exports = { registerUserService };
