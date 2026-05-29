const mongoose = require("mongoose");

// User schema centralizes identity, authentication state, and account metadata.
const userSchema = new mongoose.Schema(
  {
    // Basic profile name shown throughout the application.
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [50, "Name cannot be more than 50 characters"],
    },

    // Email is normalized and uniquely identifies a user account.
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

    // Local-auth users require a password; OAuth users can authenticate without one.
    password: {
      type: String,
      required: function () {
        return this.authProvider === "local";
      },
      select: false,
    },

    // Tracks whether the account was created locally or through a supported OAuth provider.
    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    // Provider-specific identifier kept private because it is not needed in normal API responses.
    googleId: {
      type: String,
      default: null,
      select: false,
    },

    // Avatar metadata supports both a public URL and provider/file-service cleanup id.
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

    // Role controls authorization decisions for protected/admin routes.
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // Email verification state gates flows that require a trusted email address.
    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    // Store only hashed OTP values so verification secrets are never saved in plain text.
    emailVerificationOtpHash: {
      type: String,
      select: false,
    },

    emailVerificationOtpExpiresAt: {
      type: Date,
      select: false,
    },

    // Password reset OTP fields are hidden from queries by default for account safety.
    passwordResetOtpHash: {
      type: String,
      select: false,
    },

    passwordResetOtpExpiresAt: {
      type: Date,
      select: false,
    },

    // Hashed refresh token enables session rotation/revocation without storing bearer tokens.
    refreshTokenHash: {
      type: String,
      select: false,
    },

    // Timestamp can be used to invalidate tokens issued before a password change.
    passwordChangedAt: {
      type: Date,
    },

    // Last login timestamp supports audit, analytics, and user-facing security notices.
    lastLoginAt: {
      type: Date,
    },

    // Soft account status flag keeps user history while preventing access when disabled.
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
