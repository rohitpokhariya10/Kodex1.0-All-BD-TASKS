const express = require("express");
const { registerUserController } = require("../controller/auth.controller");
const authRouter = express.Router();

authRouter.post("/register" , registerUserController);
module.exports = authRouter;