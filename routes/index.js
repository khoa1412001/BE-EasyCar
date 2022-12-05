const authRoute = require("./AuthRoute");
const searchAddressRoute = require("./SearchAddressRoute");
const userRoute = require("./UserRoute");
const filterRoute = require("./FilterRoute");
const vehicleRoute = require("./VehicleRoute");
const adminRoute = require("./AdminRoute");
const ownedVehicleRoute = require("./OwnedVehicleRoute");
const paymentRoute = require("./PaymentRoute");
const rentalVehicleRoute = require("./RentalVehicleRoute");

const testRoute = require("./TestRoute");

const role = require("../configs/RoleList");
const passport = require("../middlewares/VerifyJWT");
const verifyRoles = require("../middlewares/VerifyRoles");

function route(app) {
  app.use("/api/auth", authRoute);
  app.use("/api/user", passport, userRoute);
  app.use("/api/vehicle", vehicleRoute);
  app.use("/api/search-address", searchAddressRoute);
  app.use("/api/filter", filterRoute);
  app.use("/api/admin", passport, verifyRoles(role.ADMIN, role.STAFF), adminRoute);
  app.use("/api/my-vehicle", passport, ownedVehicleRoute);
  app.use("/api/payment", passport, paymentRoute);
  app.use("/api/history", passport, rentalVehicleRoute);
  app.use("/api/test", testRoute);
}

module.exports = route;
