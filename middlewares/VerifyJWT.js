const jwt = require("jsonwebtoken");
require("dotenv").config;
function authenticateToken(req, res, next) {
  const authHeader =
    req.headers["authorization"] || req.headers["Authorization"];
  if (!authHeader?.startsWith("Bearer")) return res.sendStatus(401);
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_KEY, (err, user) => {
    if (err) {
      console.log(err.message);
      return res.status(403).json({ message: "Unauthenticated" });
    }
    req.user = {
      userId: user.userId,
      role: user.role,
    };
    next();
  });
}

module.exports = authenticateToken;
