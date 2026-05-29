const crypto = require("crypto");

// Creates a deterministic SHA-256 digest for tokens that should not be stored directly.
const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};
module.exports = { hashToken };
