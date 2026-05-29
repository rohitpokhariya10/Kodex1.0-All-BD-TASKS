const express = require("express");
const { registerUserController, loginUserController } = require("../controller/auth.controller");
const authRouter = express.Router();

// Public registration endpoint; validation and token creation happen in the service layer.
authRouter.post("/register" , registerUserController);
// Public login endpoint; controller writes auth cookies after successful credential validation.
authRouter.post("/login" , loginUserController)
module.exports = authRouter;
