const jwt = require("jsonwebtoken");

// Generates a short-lived JWT used to authorize protected API requests.
const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
  });
};

// Generates a longer-lived JWT used to refresh access without re-authentication.
const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  });
};

// Verifies an access token and returns the decoded payload when valid.
const verifyToken =  (token)=>{
    return  jwt.verify(token , process.env.JWT_ACCESS_SECRET)
}

module.exports = {generateAccessToken , generateRefreshToken , verifyToken}
