function ErrorPayload(res, msg) {
  return res.status(400).json({ message: msg });
}
module.exports = ErrorPayload;
