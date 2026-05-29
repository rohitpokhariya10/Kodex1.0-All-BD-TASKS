const { createProductService } = require("../service/product.service");

const createProductController = async (req, res, next) => {
  try {
    
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
  } catch (error) {
    next(error);
  }
};

module.exports = { createProductController };