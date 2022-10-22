const jwt = require("jsonwebtoken");
require("dotenv").config;
function generateToken(id, role) {
  let jwtKey = process.env.ACCESS_KEY;
  let data = {
    userId: id,
    role: role,
  };
  const token = jwt.sign(data, jwtKey);
  return token;
}

module.exports = { generateToken };
