const {
  createProductService,
  getAllProductsService,
  getSingleProductByIdService,
  updateProductService,
  deleteProductByIdService,
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

const getSingleProductByIdController = async (req, res) => {
  let product = await getSingleProductByIdService(req.params);
  console.log("product by id -->", product);
  return res.status(200).json({
    success: true,
    message: "Product fetched successfully",
    product,
  });
};

const updateProductController = async (req, res) => {
  //console.log("req.user--->" , req.user)
  let updatedProduct = await updateProductService(
    req.body,
    req.params,
    req.files,
    req.user.id,
  );
  return res.status(200).json({
    success: true,
    message: "Product updated successfullly",
  });
};

const deleteProductByIdController = async (req, res) => {
  let deletedProduct = await deleteProductByIdService(req.params , req.user.id);
  console.log("hi-->" , deletedProduct)
  return res.status(200).json({
    message: `${deletedProduct.productName} deleted successfully`,
    success: true,
    deletedProduct
  });
};

module.exports = {
  createProductController,
  getAllProductsController,
  getSingleProductByIdController,
  updateProductController,
  deleteProductByIdController,
};
