function SuccessMsgPayload(res, msg) {
  return res.status(200).json({ message: msg });
}
module.exports = SuccessMsgPayload;
