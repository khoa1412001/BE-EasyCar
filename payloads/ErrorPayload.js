function errorPayload(res, error) {
  console.log(error.message);
  return res.status(400).json({ message: "Lỗi hệ thống vui lòng thử lại sau" });
}
module.exports = errorPayload;
