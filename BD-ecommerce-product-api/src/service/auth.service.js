const User = require("../models/user.model");
const ApiError = require("../utils/apiError");
const { hashToken } = require("../utils/crypto.utils");
const { hashPassword, comparePassword } = require("../utils/password.util");
const { generateAccessToken, generateRefreshToken } = require("../utils/token");

// Creates a local user account, issues auth tokens, and persists only a hashed refresh token.
const registerUserService = async ({ name, email, password }) => {
  // Validate required fields early so the controller can return precise client errors.
  if (!name?.trim()) {
    throw new ApiError(400, "Name is required");
  }

  if (!email?.trim()) {
    throw new ApiError(400, "Email is required");
  }

  if (!password?.trim()) {
    throw new ApiError(400, "Password is required");
  }

  // Normalize email before lookup and storage to avoid duplicate accounts with casing differences.
  const normalizedEmail = email.trim().toLowerCase();
  if (!name) {
    throw new ApiError(400, "All fields are required");
  }
  // Enforce account uniqueness at the service layer before attempting creation.
  let existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    throw new ApiError(409, "User already exists with this email");
  }

  // Store a one-way password hash instead of the raw password.
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

  // Hash refresh tokens at rest so a database leak does not expose usable session tokens.
  let hashRefreshToken = hashToken(refreshToken);

  user.refreshTokenHash = hashRefreshToken;
  await user.save();

  // Shape the response explicitly to prevent leaking sensitive schema fields.
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

  return { safeUser, accessToken, refreshToken };
};

// Authenticates an existing local user and rotates the refresh token for the session.
const loginUserService = async ({ email, password }) => {
  // Validate email before performing a database lookup.
  if (!email?.trim()) {
    throw new ApiError(400, "Email is required");
  }

  // Validate password presence before running bcrypt comparison.
  if (!password?.trim()) {
    throw new ApiError(400, "Password is required");
  }

  // Normalize email so login behavior matches registration-time storage.
  const normalizedEmail = email.trim().toLowerCase();

  // Explicitly include sensitive fields needed only for internal credential checks.
  let user = await User.findOne({ email: normalizedEmail }).select(
    "+password +refreshTokenHash",
  );

  // Return the same generic error for missing users to avoid account enumeration.
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  // Block disabled accounts even when credentials are otherwise valid.
  if (user.isActive === false) {
    throw new ApiError(403, "Your account has been disabled");
  }

  // Compare the supplied password with the stored bcrypt hash.
  const isPasswordCorrect = await comparePassword(password, user.password);
  console.log(password, user.password);

  // Reject invalid credentials without exposing whether the email exists.
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid Password");
  }

  // Issue fresh tokens after successful authentication.
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Prepare a hashed refresh token value for safe persistence.
  let refreshTokenHash = hashToken(refreshToken);
  user.refreshTokenHash = refreshTokenHash;
  await user.save();

  // Safe user response excludes password and refresh-token storage fields.
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
  return {
    user: safeUser,
    accessToken,
    refreshToken,
  };
};

const logOutUserService = async ({ refreshToken }) => {
  //console.log(refreshToken)
  if (!refreshToken) {
    //Because logout should still clear cookies even if token is missing/expired.
    return null;
  }
  let refreshTokenHash = hashToken(refreshToken);
  let user = await User.findOneAndUpdate(
    { refreshTokenHash },
    {
      //$unset --> Remove refreshToken field from this user document.
      $unset: {
        refreshTokenHash: 1,
      },
    },
    {
      new: true,
    },
  );
  //console.log("logout user-->" , user)
  if (!user) {
    throw new ApiError(404, "User not found");
  }
};

const googleAuthCallbackService = async ({ user }) => {

  console.log("user------->", user);
  if (!user) {
    throw new ApiError(401, "Google authentication failed");
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  const refreshTokenHash = hashToken(refreshToken);
  user.refreshTokenHash = refreshTokenHash;
  user.lastLoginAt = Date.now();
  await user.save({ validateBeforeSave: false });

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

  return { safeUser, accessToken, refreshToken };
};
module.exports = {
  registerUserService,
  loginUserService,
  logOutUserService,
  googleAuthCallbackService,
};
