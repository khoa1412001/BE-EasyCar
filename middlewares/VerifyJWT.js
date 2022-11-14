const jwt = require("jsonwebtoken"),
  { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");
require("dotenv").config;
const client = new OAuth2Client(process.env.GOOGLE_OAUTH_CLIENT_ID);
async function authenticateToken(req, res, next) {
  const authHeader =
    req.headers["authorization"] || req.headers["Authorization"];
  if (!authHeader?.startsWith("Bearer")) return res.sendStatus(401);
  const token = authHeader.split(" ")[1];
  try {
    const user = jwt.verify(token, process.env.ACCESS_KEY);
    req.user = {
      userId: user.userId,
      role: user.role,
    };
    next();
    return;
  } catch (error) {
    console.log(error.message);
  }

  try {
    const result = await client.getTokenInfo(token);
    const userGoogle = await User.findOne(
      { email: result.email },
      "role"
    ).lean();
    req.user = {
      userId: userGoogle._id,
      role: userGoogle.role,
    };
    next();
    return;
  } catch (error) {
    console.log(error.message);
  }
  return res.status(403).json({ message: "Unauthenticated" });
}

module.exports = authenticateToken;
