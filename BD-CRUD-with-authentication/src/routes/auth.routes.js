const express = require("express");
const { registerUserController } = require("../controller/auth.controller");

// Router for authentication endpoints.
const authRouter = express.Router();


// Create a new user and issue a JWT cookie.
authRouter.post("/register" , registerUserController);

module.exports = authRouter;
