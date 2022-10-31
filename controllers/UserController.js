const User = require("../models/User");

async function UpdateUser(req, res) {
  const { location, username, phonenumber, gender } = req.body;
  try {
    const user = await User.findById(req.user.userId);
    if (location) user.location = location;
    if (username) user.username = username;
    if (phonenumber) user.phoneNumber = phonenumber;
    if (gender) user.gender = gender;
    await user.save();
    return res.status(200).json({ message: "Cập nhật thông tin thành công" });
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .json({ message: "Cập nhật thông tin thất bại, vui lòng thử lại sau" });
  }
}
async function UpdateAvatar(req, res) {
  try {
    //xu ly xoa hinh anh cu~
    const user = await User.findById(req.user.userId);
    user.avatar = req.file.path;
    await user.save();
    return res
      .status(200)
      .json({ message: "Cập nhật ảnh đại diện thành công" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Lỗi hệ thống, vui lòng thử lại sau" });
  }
}
module.exports = { UpdateUser, UpdateAvatar };
