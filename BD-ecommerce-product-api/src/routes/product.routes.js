const express = require("express");
const verifyUser = require("../middleware/auth.middleware");
const { createProductController } = require("../controller/product.controller");

const productRouter = express.Router();


productRouter.post("/create" , verifyUser ,createProductController);

module.exports = productRouter;