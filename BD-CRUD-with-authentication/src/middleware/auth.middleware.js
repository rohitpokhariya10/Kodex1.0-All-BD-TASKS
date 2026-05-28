const User = require("../models/user.model");
const ApiError = require("../utils/apiError");
const { verifyToken } = require("../utils/token");



const authMiddleware = async (req, res, next) => {
  try {
    // Get JWT token from cookies
    //console.log("cookies-->" , req.cookies);
    const token = req.cookies?.JWT_TOKEN;
    //console.log("token-->" , token)

    // If token is not present, user is not logged in
    if (!token) {
      throw new ApiError(401, "Unauthorized user");
    }

    // Verify JWT token and decode user data
    const decoded = verifyToken(token);

    // If token is invalid or expired
    if (!decoded) {
      throw new ApiError(401, "Invalid or expired token");
    }

    // Find user from database using id stored inside token
    const user = await User.findById(decoded.id);

    // If user does not exist in database
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Attach logged-in user data to request object
    req.user = user;

    // Move to next middleware/controller
    next();
  } catch (error) {
    console.error("Error in authMiddleware" , error)
    // Send error to global error middleware
    next(error);
  }
};

module.exports = authMiddleware;
