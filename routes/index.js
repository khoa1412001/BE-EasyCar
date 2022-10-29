const authRoute = require("./AuthRoute");
const imageRoute = require("./ImageRoute");
const searchAddressRoute = require("./SearchAddressRoute");
const userRoute = require("./UserRoute");
const filterRoute = require("./FilterRoute")
function route(app) {
  app.use("/api/auth", authRoute);
  app.use("/api/user", userRoute);
  app.use("/api/search-address", searchAddressRoute);
  //app.use("/api/image", imageRoute);
  app.use("/api/filter", filterRoute)
}

module.exports = route;
