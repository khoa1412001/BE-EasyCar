const authRoute = require("./AuthRoute");
const searchAddressRoute = require("./SearchAddressRoute");
const userRoute = require("./UserRoute");
const filterRoute = require("./FilterRoute");
const vehicleRoute = require("./VehicleRoute");
const adminRoute = require("./AdminRoute");

const role = require("../configs/RoleList");
const passport = require("../middlewares/VerifyJWT");
const verifyRoles = require("../middlewares/VerifyRoles");

function route(app) {
  app.use("/api/auth", authRoute);
  app.use("/api/user", passport, userRoute);
  app.use("/api/vehicle", vehicleRoute);
  app.use("/api/search-address", searchAddressRoute);
  app.use("/api/filter", filterRoute);
  app.use(
    "/api/admin",
    passport,
    verifyRoles(role.ADMIN, role.STAFF),
    adminRoute
  );
}

module.exports = route;
