const crypto = require("crypto");
const JWT = require("jsonwebtoken");

const genToken = (data) => {
  return JWT.sign(data, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_DURATION,
  });
};
const verifyToken = (token) => {
  return JWT.verify(token, process.env.JWT_SECRET);
};

const genOTP = () => {
  return crypto.randomInt(100000, 999999);
};

module.exports = { genOTP, genToken, verifyToken };
