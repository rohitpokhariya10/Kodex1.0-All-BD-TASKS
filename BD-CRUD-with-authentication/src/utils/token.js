const jwt = require("jsonwebtoken");
const generateJwtToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn:process.env.TOKEN_EXPIRY });
};

const verifyToken = (token)=>{
    return jwt.verify(token, process.env.JWT_SECRET);
}
module.exports = {generateJwtToken , verifyToken};