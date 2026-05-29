const express = require("express");
const { registerUserController } = require("../controller/auth.controller");
const authRouter = express.Router();

// Public registration endpoint; validation and token creation happen in the service layer.
authRouter.post("/register" , registerUserController);
module.exports = authRouter;
