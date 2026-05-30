const mongoose = require("mongoose");
const Product = require("../models/product.model");
const imagekit = require("../config/imageKit");
const ApiError = require("../utils/apiError");
const uploadToImageKit = require("../utils/uploadToImageKit");

const allowedCategories = [
  "electronics",
  "fashion",
  "grocery",
  "mobile",
  "laptop",
  "beauty",
  "sports",
  "home",
  "books",
  "toys",
  "other",
];
//helper function to give image url in the form of array
const uploadProductImages = async (files) => {
  const imageUrls = [];

  if (files && files.length > 0) {
    const uploadPromises = files.map((file) => {
      return uploadToImageKit({
        file: file.buffer,
        fileName: `${Date.now()} - ${file.originalname}`,
        folder: "/ecommerce/products",
      });
    });
    const uploadedImages = await Promise.all(uploadPromises);
    uploadedImages.forEach((image) => {
      // console.log("image-->",image);
      imageUrls.push({url:image.url , fileId:image.fileId});
      
    });
  }
  console.log("ImageUrls of uploadProductImages -->", imageUrls);
  return imageUrls;
};

const createProductService = async (
  { productName, price, description, category },
  filesData,
  userId,
) => {
  const files = filesData;

  if (!productName) {
    throw new ApiError(400, "Product name is required");
  }

  if (!price) {
    throw new ApiError(400, "Product price is required");
  }

  const numericPrice = Number(price);

  if (Number.isNaN(numericPrice)) {
    throw new ApiError(400, "Price must be a valid number");
  }

  if (numericPrice < 0) {
    throw new ApiError(400, "Price cannot be negative");
  }

  let imageUrls = await uploadProductImages(files);
  const product = await Product.create({
    user: userId,
    productName,
    description,
    price: numericPrice,
    category,
    images: imageUrls,
  });

  return product;
};

const getAllProductsService = async (query) => {
  const { category } = query;

  const filter = {};

  if (category) {
    const cleanCategory = category.trim().toLowerCase();

    if (!allowedCategories.includes(cleanCategory)) {
      throw new ApiError(
        400,
        `Invalid category. Allowed categories are: ${allowedCategories.join(", ")}`,
      );
    }

    filter.category = cleanCategory;
  }

  const products = await Product.find(filter).sort({ createdAt: -1 });

  return products;
};

const getSingleProductByIdService = async ({ id }) => {
  console.log("Product id-->", id);
  if (!id) {
    throw new ApiError(400, "Product id is required");
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid product id");
  }
  let product = await Product.findById(id);

  if (!product) {
    throw new ApiError(404, "Productnot found");
  }
  return product;
};

const updateProductService = async (
  { productName, description, price, category },
  { id },
  files,
  userId,
) => {
  //  console.log("files-->", files); //files is an array
  if (!id) {
    throw new ApiError(400, "Product id is required");
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid product id");
  }
  let product = await Product.findById(id);

  console.log("product-->", product);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  if (product.user.toString() !== userId.toString()) {
    console.log("id check-->", product.user, userId);
    throw new ApiError(403, "You are not allowed to update");
  }

  if (productName !== undefined) {
    if (!productName.trim()) {
      throw new ApiError(400, "Product name cannot be empty");
    }

    product.productName = productName.trim();
  }

  if (description !== undefined) {
    product.description = description.trim();
  }

  if (price !== undefined) {
    const numericPrice = Number(price);

    if (Number.isNaN(numericPrice)) {
      throw new ApiError(400, "Price must be a valid number");
    }

    if (numericPrice < 0) {
      throw new ApiError(400, "Price cannot be negative");
    }

    product.price = numericPrice;
  }

  if (files && files.length > 0) {
    console.log("product-->", product);
    const imageUrls = await uploadProductImages(files);

    // This replaces old images in database
    product.images = imageUrls;
  }

  await product.save();

  return product;
};

const deleteProductByIdService = async ({ id }, userId) => {
//  console.log("deleted pid-->", id);
  if (!id) {
    throw new ApiError(400, "Product id is required");
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid product id");
  }
  let product = await Product.findById(id);
  //console.log("deleted product-->", product);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // Owner check: only product creator can delete
  if (product.user.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not allowed to delete this product");
  }

  if (product.images && product.images.length > 0) {
    const deleteImagePromises = product.images.map((image) => {
      return imagekit.deleteFile(image.fileId);
    });

    await Promise.all(deleteImagePromises);
  }

  const deletedProduct = await Product.findByIdAndDelete(id);

  return deletedProduct;
};

module.exports = {
  createProductService,
  getAllProductsService,
  getSingleProductByIdService,
  updateProductService,
  deleteProductByIdService,
};
