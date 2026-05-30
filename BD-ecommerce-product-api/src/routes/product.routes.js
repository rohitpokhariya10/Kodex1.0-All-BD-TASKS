const express = require("express");
const verifyUser = require("../middleware/auth.middleware");
const { createProductController, getAllProductsController, getSingleProductByIdController, updateProductController } = require("../controller/product.controller");
const upload = require("../middleware/multer.middleware");

const productRouter = express.Router();


productRouter.post("/create" , verifyUser ,upload.array("images" , 5) ,createProductController );
productRouter.get("/get-products" , getAllProductsController );
productRouter.get("/get-product/:id" , getSingleProductByIdController)
productRouter.put("/:id" , verifyUser , upload.array("images" , 5) , updateProductController)
productRouter.delete("/delete-product/:id" , verifyUser , )
module.exports = productRouter;