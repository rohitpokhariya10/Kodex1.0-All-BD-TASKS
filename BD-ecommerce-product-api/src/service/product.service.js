const Product = require("../models/product.model");
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

  const imageUrls = [];

  if (files && files.length > 0) {
    const uploadPromises = files.map((file) => {
      return uploadToImageKit({
        file: file.buffer,
        fileName: `product-${Date.now()}-${files.fileName}`,
        folder: "/ecommerce/products",
      });
    });

    const uploadedImages = await Promise.all(uploadPromises);

    uploadedImages.forEach((image) => {
      imageUrls.push(image.url);
    });
  }

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
module.exports = {
  createProductService,
  getAllProductsService,
  getSingleProductByIdService,
};
