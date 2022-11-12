const Vehicle = require("../models/Vehicle");
const moment = require("moment");

async function GetVehicleWithFilter(req, res) {
  let perPage = 10; //10
  let page = Number(req.body.page) || 1;
  let startDate = new Date(Number(req.body.startDate));
  let endDate = new Date(Number(req.body.endDate));
  const oneDay = 1000 * 60 * 60 * 24;
  const diffInTime = endDate.getTime() - startDate.getTime();
  const days = Math.round(diffInTime / oneDay);

  var filter = {};
  if (req.body.cartype.length !== 1) {
    filter.type = req.body.cartype;
    filter.type.shift();
  }
  if (req.body.price !== "ALL" && req.body.price) {
    switch (req.body.price) {
      case "1M":
        filter.rentprice = { $lt: 1000 };
        break;
      case "2M":
        filter.rentprice = { $lt: 2000, $gte: 1000 };
        break;
      case "3M":
        filter.rentprice = { $lt: 3000, $gte: 2000 };
        break;
      case "4M":
        filter.rentprice = { $gte: 1000 };
        break;
      default:
        break;
    }
  }
  if (req.body.carbrand !== "ALL" && req.body.carbrand) {
    filter.brand = req.body.carbrand;
  }
  if (req.body.fueltype !== "ALL" && req.body.fueltype) {
    filter.fueltype = req.body.fueltype;
  }
  if (req.body.transmission !== "ALL" && req.body.transmission) {
    filter.transmission = req.body.transmission;
  }
  var rating = req.body.rating.find((item) => item.selected);
  if (rating.value !== "All") {
    filter.rating = { $gte: Number(rating.value.split("+")[0]) };
  }
  try {
    var totalVehicle = 0;
    if (page === 1) totalVehicle = await Vehicle.countDocuments(filter);
    let results = await Vehicle.find(filter)
      .skip(perPage * page - perPage)
      .limit(perPage);
    results.map(
      (result) => (result.totalPrice = result.rentprice * 1.1 * days)
    );
    return res.status(200).json({
      totalPage: Math.ceil(totalVehicle / perPage),
      data: results,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Lỗi hệ thống" });
  }
}

module.exports = { GetVehicleWithFilter };
