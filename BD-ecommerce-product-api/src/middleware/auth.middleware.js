const ApiError = require("../utils/apiError");
const { verifyToken } = require("../utils/token");

// Protects routes by requiring a valid access token from the request cookies.
const verifyUser = async (req, res, next) => {
  try {
    // Access tokens are read from cookies to support httpOnly browser sessions.
    const { accessToken } = req.cookies;

    // Stop unauthenticated requests before route handlers execute.
    if (!accessToken) {
      throw new ApiError(401, "Unauthorized: access token missing");
    }

    // Verify JWT integrity and expiration using the configured access-token secret.
    const decoded = verifyToken(accessToken);

    // Attach decoded token payload for downstream authorization logic.
    req.user = decoded;

    next();
  } catch (error) {
    // Convert all token failures into a consistent unauthorized API response.
    next(new ApiError(401, "Invalid or expired access token"));
  }
};

module.exports = verifyUser;
