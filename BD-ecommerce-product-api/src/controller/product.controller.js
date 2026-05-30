const {
  createProductService,
  getAllProductsService,
  getSingleProductByIdService,
} = require("../service/product.service");

const createProductController = async (req, res) => {
  const product = await createProductService(req.body, req.files, req.user.id);
  console.log("files-->", req.files);

  return res.status(201).json({
    success: true,
    message: "Product created successfully",
    data: product,
  });
};

const getAllProductsController = async (req, res) => {
  const products = await getAllProductsService(req.query);

  return res.status(200).json({
    success: true,
    message: "Products fetched successfully",
    count: products.length,
    data: products,
  });
};

const getSingleProductByIdController = async (req , res)=>{
  let product = await getSingleProductByIdService(req.params);
  console.log("product by id -->" , product)
   return res.status(200).json({
    success: true,
    message: "Product fetched successfully",
   product,
  });

}

module.exports = { createProductController, getAllProductsController , getSingleProductByIdController};
