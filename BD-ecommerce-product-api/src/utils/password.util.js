const bcrypt = require("bcrypt");

// Hashes a plain-text password using a configurable bcrypt work factor.
const hashPassword = async (password) => {
  const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
  return await bcrypt.hash(password, saltRounds);
};

// Compares a login password against its stored bcrypt hash.
const comparePassword = async (password, hashPassword) => {
  return await bcrypt.compare(password, hashPassword);
};

module.exports = {hashPassword , comparePassword};
