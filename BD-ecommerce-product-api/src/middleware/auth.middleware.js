const ApiError = require("../utils/apiError");

// Validates that an incoming request contains an access token cookie.
const verifyUser = async (req, res, next) => {
    // Read the access token from cookies so protected routes can rely on httpOnly auth storage.
    let {accessToken} = req.cookies;
    console.log("accessToken-->" , accessToken);

    // Reject unauthenticated requests before they reach protected route handlers.
    if(!accessToken){
        throw new ApiError(401 , "Token wrong or expired");
    }
    
};
