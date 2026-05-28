const User = require("../models/user.model");
const ApiError = require("../utils/apiError");
const { generateJwtToken } = require("../utils/token");

const registerUserService = async ({name , email})=>{

    // Validate name field
    if (!name) {
      throw new ApiError(400, "Name is required");
    }

    // Validate email field
    if (!email) {
      throw new ApiError(400, "Email is required");
    }

    // Create a new user in database
    const newUser = await User.create({
      name,
      email,
    });

    // Generate JWT token using newly created user's id
    const token = generateJwtToken(newUser._id);

    return {token , newUser};
}

module.exports = {registerUserService};
