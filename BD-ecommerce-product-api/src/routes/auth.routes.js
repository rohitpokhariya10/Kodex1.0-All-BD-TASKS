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

// Public registration endpoint; validation and token creation happen in the service layer.
authRouter.post("/register", registerUserController);
// Public login endpoint; controller writes auth cookies after successful credential validation.
authRouter.post("/login", loginUserController);
//logout route
authRouter.post("/logout", logOutUserController);

authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"], session: false }),
);
authRouter.get("/google/callback" , passport.authenticate("google" , {failureRedirect:"/login",session:false}) , googleAuthCallbackController)
module.exports = authRouter;
