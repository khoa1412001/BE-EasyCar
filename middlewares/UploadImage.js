const cloudinary = require("../utils/cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: file.fieldname,
      format: file.originalname.split(".").pop(),
    };
  },
});
const parser = multer({ storage: storage });
module.exports = parser;
