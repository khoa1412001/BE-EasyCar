const {
  ErrorPayload,
  SuccessDataPayload,
  SuccessMsgPayload,
  ErrorMsgPayload,
} = require("../payloads");
const User = require("../models/User");
const WithdrawRequest = require("../models/WithdrawRequest");
const VehicleRentalHistory = require("../models/VehicleRentalHistory");

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
};

module.exports = PaymentController;
