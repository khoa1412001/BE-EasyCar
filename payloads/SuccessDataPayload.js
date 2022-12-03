function SuccessDataPayload(res, data) {
  return res.status(200).json({ data: data });
}
module.exports = SuccessDataPayload;
