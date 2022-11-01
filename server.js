const express = require("express"),
  dotenv = require("dotenv"),
  mongoose = require("mongoose"),
  jwt = require("jsonwebtoken"),
  bodyParser = require("body-parser"),
  swaggerUi = require("swagger-ui-express"),
  cors = require("cors"),
  swaggerJsdoc = require("./configs/swaggerConfig"),
  morgan = require("morgan");
const route = require("./routes");

let PORT = process.env.PORT || 5000;
let mongodb = process.env.MONGODB_URL;

dotenv.config();
const app = express();
app.use(bodyParser.json({limit: '50mb'}));
app.use(cors({ credentials: true, origin: true }));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerJsdoc));
app.use(morgan("dev"));
mongoose
  .connect(mongodb)
  .then(() => {
    console.log("Connected");
  })
  .catch((err) => {
    console.log("err", err);
  });
app.get("/", (req, res) => {
  res.send("SUCCESS");
});

route(app);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
