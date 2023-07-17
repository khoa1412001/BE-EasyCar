const carStatusList = require("../configs/CarStatus");
const Vehicle = require("../models/Vehicle");
const VehicleRentalHistory = require("../models/VehicleRentalHistory");
const haversine = require("haversine");
const { ErrorPayload, SuccessDataPayload } = require("../payloads");
const moment = require("moment/moment");
const axios = require("axios");
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
        filter.rentprice = { $lt: 2000 };
        break;
      case "3M":
        filter.rentprice = { $lt: 3000 };
        break;
      case "4M":
        filter.rentprice = { $lt: 4000 };
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
      "brand model fueltype transmission seats rating modelimage rentprice location latitude longitude year vehicleimage"
    )
      .populate("ownerId", "location")
      .lean();
    results = results.filter((item) => {
      var endPoint = ({ longitude, latitude } = item);
      return haversine(startPoint, endPoint, { threshold: 3, unit: "km" });
    });
    results.map((result) => {
      result.totalprice = Math.round(result.rentprice * 1.1 * days);
      result.basicinsurance = Math.round(result.totalprice * 0.085);
      result.totalprice = Math.round(result.totalprice + result.basicinsurance);
    });
    return res.status(200).json({
      data: results,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({ message: "Lỗi hệ thống" });
  }
}

async function TextFilter(req, res) {
  try {
    const requireList = req.query.q.split(",");
    var [priceFrom, priceTo] = requireList[0].split("-").map((item) => parseInt(item, 10) * 1000);
    var [rentalDateStart, rentalDateEnd] = requireList[1]
      .split("-")
      .map((item) => moment(item, "DD/MM/YYYY").toDate());
    var seat = parseInt(requireList[2], 10);
    var engine = requireList[3].replaceAll(/\s/g, "");
    let result = await Vehicle.find({
      seats: { $gte: seat },
      transmission: engine,
      rentprice: { $lte: priceTo, $gte: priceFrom },
    }).lean();

    var validResult = [];
    var i = 0;

    while (true) {
      if (validResult.length == 5 || i == result.length) break;

      const historyList = await VehicleRentalHistory.find({
        vehicleId: result[i]._id,
        $and: [{ rentalDateEnd: { $gt: Date.now() } }, { rentalDateStart: { $gt: Date.now() } }],
      }).lean();

      var checkResult = historyList.every(
        (item) => rentalDateEnd < item.rentalDateStart || rentalDateStart > item.rentalDateEnd
      );

      if (checkResult)
        validResult.push({
          name: `${result[i].brand} ${result[i].model}`,
          link:
            process.env.FRONTEND_URL +
            `/details?id=${result[i]._id}&startdate=${rentalDateStart.getTime() / 1000}&enddate=${
              rentalDateEnd.getTime() / 1000
            }`,
        });
      i++;
    }
    return SuccessDataPayload(res, validResult);
  } catch (error) {
    return ErrorPayload(res, error);
  }
}
// 500 - 1000, 24/02/2023 - 25/02/2023, 4, AUTO
// 500 - 1000, 24/02/2023 - 25/02/2023, 4, MANUAL
// Những xe phù hợp yêu cầu
// HUYNDAI ACCENT
// FE_URL/details?id={id}&startdate={startdate.unix()}&enddate={enddate.unix()}

// Không có xe phù hợp yêu cầu

async function ElasticSearch(req, res) {
  let startDate = new Date(Number(req.query.startdate) * 1000);
  let endDate = new Date(Number(req.query.enddate) * 1000);
  const oneDay = 1000 * 60 * 60 * 24;
  const diffInTime = endDate.getTime() - startDate.getTime();
  const days = Math.ceil(diffInTime / oneDay);
  const query = req.query.query;
  var result = [];
  try {
    axios
      .get(process.env.ELASTIC_URI + encodeURIComponent(query))
      .then((response) => {
        response.data.hits.hits.map((item) => {
          result.push(item._source);
        });
        result.map((result) => {
          result.totalprice = Math.round(result.rentprice * 1.1 * days);
          result.basicinsurance = Math.round(result.totalprice * 0.085);
          result.totalprice = Math.round(result.totalprice + result.basicinsurance);
        });
        console.log(result);
        return res.status(200).json(result);
      })
      .catch((err) => {
        console.log(err);
        return res.status(400).json("Lỗi máy chủ, vui lòng thử lại sau");
      });
  } catch (error) {
    return ErrorPayload(res, error);
  }
}

module.exports = { GetVehicleWithFilter, TextFilter, ElasticSearch };
