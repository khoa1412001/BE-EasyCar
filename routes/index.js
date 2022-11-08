const authRoute = require("./AuthRoute");
const searchAddressRoute = require("./SearchAddressRoute");
const userRoute = require("./UserRoute");
const filterRoute = require("./FilterRoute");
const vehicleRoute = require("./VehicleRoute");
const testRoute = require("./TestRoute");
function route(app) {
  app.use("/api/auth", authRoute);
  app.use("/api/user", userRoute);
  app.use("/api/vehicle", vehicleRoute);
  app.use("/api/search-address", searchAddressRoute);
  app.use("/api/filter", filterRoute);
  app.use("/api/test", testRoute);
}

module.exports = route;
