const express = require("express"),
  dotenv = require("dotenv"),
  mongoose = require("mongoose"),
  jwt = require("jsonwebtoken"),
  bodyParser = require("body-parser");
const route = require("./routes");

dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let PORT = process.env.PORT || 5000;
let mongodb = process.env.MONGODB_URL;

mongoose
  .connect(mongodb)
  .then(() => {
    console.log("Connected");
  })
  .catch((err) => {
    console.log("err", err);
  });

// app.post("/user/generateToken", (req, res) => {
//   let jwtKey = process.env.JWT_SECRET_KEY;
//   let data = {
//     time: Date(),
//     userId: 12,
//   };
//   const token = jwt.sign(data, jwtKey);
//   res.send(token);
// });
// app.get("/user/validateToken", (req, res) => {
//   let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
//   let jwtKey = process.env.JWT_SECRET_KEY;
//   try {
//     const token = req.header(tokenHeaderKey);
//     const verified = jwt.verify(token, jwtKey);
//     if (verified) {
//       return res.send("success");
//     } else {
//       return res.status(401).send(error);
//     }
//   } catch (error) {
//     return res.status(401).send(error);
//   }
// });
app.use((req, res, next) => {
  var start = new Date();
  var url = `${req.method} ${req.url}`;
  next();
  console.log(`${url} ${new Date() - start} ms`);
});
route(app);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
