const {
  ErrorPayload,
  SuccessDataPayload,
  SuccessMsgPayload,
  ErrorMsgPayload,
} = require("../payloads");
const User = require("../models/User");
const WithdrawRequest = require("../models/WithdrawRequest");
const VehicleRentalHistory = require("../models/VehicleRentalHistory");
const Vehicle = require("../models/Vehicle");
require("dotenv").config();
const crypto = require("crypto");
const https = require("https");
// const frontendUrl = 'http://localhost:3000/'
// const backendUrl = 'http://localhost:5000/'
const frontendUrl = process.env.FRONTEND_URL;
const backendUrl = process.env.BACKEND_URL;

const PaymentController = {
  AddWithdrawRequest: async (req, res) => {
    try {
      const amount = req.body.amount;
      const user = await User.findById(req.user.userId, "balance").lean();
      if (user.balance < amount)
        ErrorMsgPayload(res, "Không đủ số dư để thực hiện yêu cầu rút tiền");

      const newBalance = user.balance - amount;
      await User.findByIdAndUpdate(req.user.userId, { balance: newBalance });
      const newRequest = new WithdrawRequest();
      newRequest.userId = req.user.userId;
      newRequest.amount = amount;
      await newRequest.save();
      SuccessMsgPayload(res, "Tạo yêu cầu rút tiền thành công");
    } catch (error) {
      ErrorPayload(res, error);
    }
  },

  GetWithdrawList: async (req, res) => {
    try {
      const result = await WithdrawRequest.find({
        userId: req.user.userId,
      }).lean();
      SuccessDataPayload(res, result);
    } catch (error) {
      ErrorPayload(res, error);
    }
  },

  createPayment: async (req, res) => {
    try {
      //https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
      //parameters
      var partnerCode = "MOMOQDD420220927";
      var accessKey = "yFRGoK0eLSrthX4Y";
      var secretkey = "tZNafmaHgldR8XfZA9wiYCFIkaXbzxbu";
      var requestId = partnerCode + new Date().getTime();
      var orderId = req.body.orderId;
      var orderInfo = "Thanh toán hoá đơn #" + orderId;
      var redirectUrl = frontendUrl + "profile/history";
      var ipnUrl = backendUrl + "api/payment/result-payment";
      var requestType = "captureWallet";
      const rentalhistory = await VehicleRentalHistory.findById(req.body.recordId);
      var amount = rentalhistory.totalPrice;
      var extraData = Buffer.from(JSON.stringify(rentalhistory._id)).toString("base64");
      //before sign HMAC SHA256 with format
      //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
      var rawSignature =
        "accessKey=" +
        accessKey +
        "&amount=" +
        amount +
        "&extraData=" +
        extraData +
        "&ipnUrl=" +
        ipnUrl +
        "&orderId=" +
        orderId +
        "&orderInfo=" +
        orderInfo +
        "&partnerCode=" +
        partnerCode +
        "&redirectUrl=" +
        redirectUrl +
        "&requestId=" +
        requestId +
        "&requestType=" +
        requestType;
      //puts raw signature
      console.log("--------------------RAW SIGNATURE----------------");
      console.log(rawSignature);
      //signature

      var signature = crypto.createHmac("sha256", secretkey).update(rawSignature).digest("hex");
      console.log("--------------------SIGNATURE----------------");
      console.log(signature);

      //json object send to MoMo endpoint
      const requestBody = JSON.stringify({
        partnerCode: partnerCode,
        accessKey: accessKey,
        requestId: requestId,
        amount: amount,
        orderId: orderId,
        orderInfo: orderInfo,
        redirectUrl: redirectUrl,
        ipnUrl: ipnUrl,
        extraData: extraData,
        requestType: requestType,
        signature: signature,
        lang: "vi",
      });
      //Create the HTTPS objects
      const options = {
        hostname: "test-payment.momo.vn",
        port: 443,
        path: "/v2/gateway/api/create",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(requestBody),
        },
      };

      let payUrl = "";
      //Send the request and get the response
      const reqPayment = https.request(options, (response) => {
        console.log(`Status: ${response.statusCode}`);
        console.log(`Headers: ${JSON.stringify(response.headers)}`);
        response.setEncoding("utf8");
        response.on("data", (body) => {
          console.log("Body: ");
          console.log(body);
          console.log("payUrl: ");
          console.log(JSON.parse(body).payUrl);
          payUrl = JSON.parse(body).payUrl;
        });
        response.on("end", () => {
          console.log("No more data in response.");
          res.status(200).json({ payUrl });
        });
      });

      reqPayment.on("error", (e) => {
        console.log(`problem with request: ${e.message}`);
      });
      // write data to request body
      console.log("Sending....");
      reqPayment.write(requestBody);
      reqPayment.end();
    } catch (e) {
      console.log(e);
      return res
        .status(500)
        .json({ error: "Lỗi tạo hoá đơn thanh toán. Vui lòng thực hiện lại thanh toán" });
    }
  },
  ipn: async (req, res) => {
    try {
      console.log(req.body);
      var resultCode = req.body.resultCode;
      var partnerCode = "MOMOQDD420220927";
      var accessKey = "yFRGoK0eLSrthX4Y";
      var secretkey = "tZNafmaHgldR8XfZA9wiYCFIkaXbzxbu";
      var orderId = req.body.orderId || req.query.orderId;
      var extraData = req.body.extraData;
      var amount = req.body.amount;
      var vehicleRentalId = JSON.parse(Buffer.from(extraData, "base64").toString("ascii"));
      var statusPayment = resultCode === 0 ? "Thành công" : "Thất bại";
      console.log(vehicleRentalId);
      if (resultCode === 0) {
        // write data to request body
        const vehiclehistory = await VehicleRentalHistory.findByIdAndUpdate(
          vehicleRentalId,
          { status: true },
          { new: true }
        );
        const vehicle = await Vehicle.findById(vehiclehistory.vehicleId);
        const user = await User.findById(vehicle.ownerId);
        const balance = user.balance + vehiclehistory.totalPrice;
        await User.findOneAndUpdate({ _id: user._id }, { balance: balance });
      }
      return res.status(204).json({});
    } catch (e) {
      return res
        .status(500)
        .json({ error: "Lỗi thanh toán hoá đơn. Vui lòng thực hiện lại thanh toán" });
    }
  },
};

module.exports = PaymentController;
