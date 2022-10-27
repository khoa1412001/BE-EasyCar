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
const axios = require("axios");

let PORT = process.env.PORT || 5000;
let mongodb = process.env.MONGODB_URL;

dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use(cors({ credentials: true, origin: true }));
app.use(bodyParser.urlencoded({ extended: true }));
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

//route(app);
app.get("/", (req, res) => {
  axios
    .get(
      "https://m-common.mioto.vn/lbs/search-address?sdkMap=2&address=20 Nguyễn Oanh"
    )
    .then((res) => {
      console.log(res.data.data.locations);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
