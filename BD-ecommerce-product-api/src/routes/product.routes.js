const express = require("express");
const verifyUser = require("../middleware/auth.middleware");
const { createProductController } = require("../controller/product.controller");
const upload = require("../middleware/multer.middleware");

const productRouter = express.Router();


productRouter.post("/create" , verifyUser ,upload.array("images" , 5) ,createProductController );

module.exports = productRouter;