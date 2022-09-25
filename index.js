const express = require("express");
const mongoose = require("mongoose");
const route = require("./routes");

const app = express();
const PORT = 3000;

mongoose
  .connect(
    `mongodb+srv://admin:1234@easy-car.kkzctvp.mongodb.net/easy-car?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("Connected");
  })
  .catch((err) => {
    console.log("err", err);
  });

route(app);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
