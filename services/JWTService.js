const jwt = require("jsonwebtoken");
require("dotenv").config;
function generateToken(id, role) {
  let ACCESS_KEY = process.env.ACCESS_KEY;
  let REFRESH_KEY = process.env.REFRESH_KEY;
  let payload = {
    userId: id,
    role: role,
  };
  const accessToken = jwt.sign(payload, ACCESS_KEY, { expiresIn: "2h" });
  // const refreshToken = jwt.sign(payload, REFRESH_KEY, { expiresIn: "30d" });

  return accessToken;
}
function generateMailToken(email) {
  payload = { email: email };
  const token = jwt.sign(payload, process.env.MAIL_VALIDATE_KEY, {
    expiresIn: "30m",
  });
  return token;
}

module.exports = { generateToken, generateMailToken };
