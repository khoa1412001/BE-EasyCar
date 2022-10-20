const userRoute = require("./UserRoute");

function route(app) {
  app.use("/auth", userRoute);

  app.use("/", (req, res) => res.send("hello"));
}

module.exports = route;
