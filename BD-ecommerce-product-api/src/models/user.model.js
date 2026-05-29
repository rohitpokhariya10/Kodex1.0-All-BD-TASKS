const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [50, "Name cannot be more than 50 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\S+@\S+\.\S+$/,
        "Please provide a valid email address",
      ],
    },

    password: {
      type: String,
      required: function () {
        return this.authProvider === "local";
      },
      select: false,
    },

    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    googleId: {
      type: String,
      default: null,
      select: false,
    },

    avatar: {
      url: {
        type: String,
        default: "",
      },
      fileId: {
        type: String,
        default: "",
      },
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    emailVerificationOtpHash: {
      type: String,
      select: false,
    },

    emailVerificationOtpExpiresAt: {
      type: Date,
      select: false,
    },

    passwordResetOtpHash: {
      type: String,
      select: false,
    },

    passwordResetOtpExpiresAt: {
      type: Date,
      select: false,
    },

    refreshTokenHash: {
      type: String,
      select: false,
    },

    passwordChangedAt: {
      type: Date,
    },

    lastLoginAt: {
      type: Date,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;