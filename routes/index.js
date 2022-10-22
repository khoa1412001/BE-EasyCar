const userRoute = require("./UserRoute");

function route(app) {
  app.use("/api/auth", userRoute);

  app.get("/api", (req, res) => res.send("hello"));
}

module.exports = route;
