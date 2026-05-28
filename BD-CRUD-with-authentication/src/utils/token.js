const jwt = require("jsonwebtoken");

// Create a signed JWT with the user's database id.
const generateJwtToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn:process.env.TOKEN_EXPIRY });
};

// Verify a JWT and return the decoded payload.
const verifyToken = (token)=>{
    return jwt.verify(token, process.env.JWT_SECRET);
}
module.exports = {generateJwtToken , verifyToken};
