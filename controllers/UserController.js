const User = require("../models/User")

async function UpdateUser(req,res) {
    const {location, username, phonenumber, gender} = req.body
    try {
    const user = await User.findById(req.user.userId)
    if (location) user.location = location
    if (username) user.username = username
    if (phonenumber) user.phoneNumber = phonenumber
    if (gender) user.gender = gender
    await user.save()
    return res.status(200).json({message: "Cập nhật thông tin thành công"})
    } catch (err) {
        console.log(err)
        return res.status(400).json({message: "Cập nhật thông tin thất bại, vui lòng thử lại sau"})
    }
}

module.exports = { UpdateUser }