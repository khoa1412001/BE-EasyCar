const carStatusList = require("../configs/CarStatus");
const Vehicle = require("../models/Vehicle");
const haversine = require("haversine");

async function GetVehicleWithFilter(req, res) {
  // let perPage = 10; //10
  // let page = Number(req.body.page) || 1;
  // check thoi gian
  const startPoint = ({ longitude, latitude } = req.body);
  let startDate = new Date(Number(req.body.startdate) * 1000);
  let endDate = new Date(Number(req.body.enddate) * 1000);
  const oneDay = 1000 * 60 * 60 * 24;
  const diffInTime = endDate.getTime() - startDate.getTime();
  const days = Math.ceil(diffInTime / oneDay);
  var filter = { status: carStatusList.ALLOW };
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
    // var totalVehicle = 0;
    // if (page === 1) totalVehicle = await Vehicle.countDocuments(filter);
    // console.log(totalVehicle);
    let results = await Vehicle.find(
      filter,
      "brand model fueltype transmission seats rating modelimage rentprice location latitude longitude"
    ).lean();
    results = results.filter((item) => {
      var endPoint = ({ longitude, latitude } = item);
      return haversine(startPoint, endPoint, { threshold: 3, unit: "mile" });
    });
    results.map((result) => {
      result.totalprice = Math.round(result.rentprice * 1.1 * days);
      result.basicinsurance = Math.round(result.totalprice * 0.085);
      result.totalprice = Math.round(result.totalprice + result.basicinsurance);
    });
    return res.status(200).json({
      totalPage: Math.ceil(totalVehicle / perPage),
      data: results,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({ message: "Lỗi hệ thống" });
  }
}

module.exports = { GetVehicleWithFilter };
