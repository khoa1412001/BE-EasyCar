const userRoute = require("./UserRoute");
const imageRoute = require("./ImageRoute");
function route(app) {
  app.use("/api/auth", userRoute);
  //app.use("/api/image", imageRoute);
  app.get("/api", (req, res) => res.send("hello"));
}

module.exports = route;
