const axios = require("axios");
function searchAddress(req, res) {
  let address = req.query.address;
  if (!address)
    return res.status(400).json({ comment: "Vui lòng nhập địa chỉ" });
  axios
    .get(
      `https://m-common.mioto.vn/lbs/search-address?sdkMap=2&address=${encodeURIComponent(
        address
      )}`
    )
    .then((response) => {
      return res.status(200).json(response.data.data.locations);
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).json("Lỗi máy chủ, vui lòng thử lại sau");
    });
}

module.exports = { searchAddress };
