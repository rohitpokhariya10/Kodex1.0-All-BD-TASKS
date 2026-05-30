const express = require("express");
const verifyUser = require("../middleware/auth.middleware");
const { createProductController, getAllProductsController, getSingleProductByIdController, updateProductController, deleteProductByIdController } = require("../controller/product.controller");
const upload = require("../middleware/multer.middleware");

const productRouter = express.Router();


/**
 * @route       POST /api/product/create
 * @description Create a new product. Requires productName and price in the request body, and accepts up to 5 images.
 * @access      Private
 */
productRouter.post("/create" , verifyUser ,upload.array("images" , 5) ,createProductController );

/**
 * @route       GET /api/product/get-products
 * @description Get all products. Supports optional category filter using query params.
 * @access      Public
 */
productRouter.get("/get-products" , getAllProductsController );

/**
 * @route       GET /api/product/get-product/:id
 * @description Get a single product by product id.
 * @access      Public
 */
productRouter.get("/get-product/:id" , getSingleProductByIdController)

/**
 * @route       PUT /api/product/:id
 * @description Update a product by product id. Only the product creator can update it.
 * @access      Private
 */
productRouter.put("/:id" , verifyUser , upload.array("images" , 5) , updateProductController)

/**
 * @route       DELETE /api/product/delete-product/:id
 * @description Delete a product by product id. Only the product creator can delete it.
 * @access      Private
 */
productRouter.delete("/delete-product/:id" , verifyUser , deleteProductByIdController)
module.exports = productRouter;
