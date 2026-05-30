const express = require("express");
const {
  registerUserController,
  loginUserController,
  logOutUserController,
  googleAuthCallbackController,
} = require("../controller/auth.controller");
const verifyUser = require("../middleware/auth.middleware");
const passport = require("../config/passwort");

const authRouter = express.Router();

/**
 * @route       POST /api/auth/register
 * @description Register a new user. Requires name, email, and password in the request body.
 * @access      Public
 */
authRouter.post("/register", registerUserController);

/**
 * @route       POST /api/auth/login
 * @description Login an existing user. Requires email and password in the request body.
 * @access      Public
 */
authRouter.post("/login", loginUserController);

/**
 * @route       POST /api/auth/logout
 * @description Logout the current user and remove the stored refresh token from the database.
 * @access      Public
 */
authRouter.post("/logout", logOutUserController);

/**
 * @route       GET /api/auth/google
 * @description Start Google OAuth authentication and redirect the user to Google login.
 * @access      Public
 */
authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"], session: false }),
);

/**
 * @route       GET /api/auth/google/callback
 * @description Handle Google OAuth callback, create or update the user, and set auth cookies.
 * @access      Public
 */
authRouter.get("/google/callback" , passport.authenticate("google" , {failureRedirect:"/login",session:false}) , googleAuthCallbackController)
module.exports = authRouter;
