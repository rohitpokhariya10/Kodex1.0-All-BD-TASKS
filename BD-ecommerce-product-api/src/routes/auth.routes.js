const express = require("express");
const { registerUserController, loginUserController, logOutUserController } = require("../controller/auth.controller");
const verifyUser = require("../middleware/auth.middleware");
const authRouter = express.Router();

// Public registration endpoint; validation and token creation happen in the service layer.
authRouter.post("/register" , registerUserController);
// Public login endpoint; controller writes auth cookies after successful credential validation.
authRouter.post("/login" , loginUserController)

authRouter.post("/logout" ,logOutUserController)
module.exports = authRouter;
