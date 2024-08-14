const crypto = require("crypto");

const genOTP = () => {
  return crypto.randomInt(100000, 999999);
};

module.exports = { genOTP };
