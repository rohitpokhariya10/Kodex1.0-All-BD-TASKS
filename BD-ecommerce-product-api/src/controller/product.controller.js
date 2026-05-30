const { createProductService, getAllProductsService } = require("../service/product.service");

const createProductController = async (req, res, next) => {
    const product = await createProductService(
      req.body,
      req.files,
      req.user.id
    );
     console.log("files-->" , req.files);

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
 
};

const getAllProductsController = async (req , res )=>{
let products = await getAllProductsService();
  return res.status(200).json({
    message:"All products fetched sucessfully",
    products,
  })
}
module.exports = { createProductController , getAllProductsController};