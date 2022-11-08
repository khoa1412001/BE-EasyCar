const { parse } = require("csv-parse");
const path = require("path");
const fs = require("fs");

const vehicleBrand = [];
const vehicleModel = [];

function loadVehicleBrandData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(path.join(__dirname, "..", "data", "brand.csv"))
      .pipe(
        parse({
          comment: "#",
          columns: true,
        })
      )
      .on("data", (data) => {
        vehicleBrand.push(data);
      })
      .on("error", (err) => {
        console.log(err);
        reject(err);
      })
      .on("end", () => {
        resolve();
      });
  });
}

function loadVehicleModelData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(path.join(__dirname, "..", "data", "model.csv"))
      .pipe(
        parse({
          comment: "#",
          columns: true,
        })
      )
      .on("data", (data) => {
        vehicleModel.push(data);
      })
      .on("error", (err) => {
        console.log(err);
        reject(err);
      })
      .on("end", () => {
        resolve();
      });
  });
}

function getVehicleBrand() {
  return vehicleBrand;
}
function getVehicleModel(brand) {
  return vehicleModel.filter((item) => item.brand === brand);
}

module.exports = {
  loadVehicleBrandData,
  loadVehicleModelData,
  getVehicleBrand,
  getVehicleModel,
};
