const cloudinary = require("../utils/cloudinary");

async function uploadImage(req, res) {
  try {
    const fileStr = req.body.data;
    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      upload_preset: "dev_setups",
    });
    console.log(uploadResponse);
    res.json({ message: "hel" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Có lỗi xảy ra từ máy chủ" });
  }
}
async function getImage(req, res) {
  const { resources } = await cloudinary.search
    .expression("folder:dev_setups")
    .sort_by("public_id", "desc")
    .max_results(30)
    .execute();
  const publicIds = resources.map();
}

module.exports = { uploadImage };
