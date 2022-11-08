const jwt = require("jsonwebtoken");
require("dotenv").config;
function generateToken(id, role) {
  let ACCESS_KEY = process.env.ACCESS_KEY;
  let REFRESH_KEY = process.env.REFRESH_KEY;
  let payload = {
    userId: id,
    role: role,
  };
  const accessToken = jwt.sign(payload, ACCESS_KEY, { expiresIn: "30m" });
  // const refreshToken = jwt.sign(payload, REFRESH_KEY, { expiresIn: "30d" });

  return accessToken;
}

module.exports = { generateToken };
