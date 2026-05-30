const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    user: {
      // Jis user ne product create kra hai us user ki id store krta hai
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    productName: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },

    category: {
      type: [
        {
          type: String,
          enum: [
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
          ],
          trim: true,
          lowercase: true,
        },
      ],
      default: ["other"],
    },

    images: {
      type: [
        {
          url: {
            type: String,
            required: true,
          },
          fileId: {
            type: String,
            required: true,
          },
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;