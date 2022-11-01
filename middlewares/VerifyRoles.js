function verifyRoles(...allowedRoles) {
  return (req, res, next) => {
    const userRole = req.user.role;
    if (!allowedRoles.includes(userRole))
      return res.status(401).send("Unauthorized");
    next();
  };
}
module.exports = verifyRoles;
