const express = require("express");
const verifyUser = require("../middleware/auth.middleware");
const { createProductController, getAllProductsController } = require("../controller/product.controller");
const upload = require("../middleware/multer.middleware");

const productRouter = express.Router();


productRouter.post("/create" , verifyUser ,upload.array("images" , 5) ,createProductController );
productRouter.get("/get-products" , getAllProductsController );
module.exports = productRouter;