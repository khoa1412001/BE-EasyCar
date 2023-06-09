function ErrorPayload(res, error = "nothing", msg) {
  console.log(error);
  return res.status(400).json({ message: msg });
}
module.exports = ErrorPayload;
