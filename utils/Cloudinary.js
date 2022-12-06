require("dotenv").config;
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
cloudinary.config({
  secure: true,
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function uploadSingle(file) {
  return new Promise((resolve, reject) => {
    let stream = cloudinary.uploader.upload_stream(
      {
        folder: file.fieldname,
        resource_type: "auto",
      },
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );

    streamifier.createReadStream(file.buffer).pipe(stream);
  });
}

async function uploadArray(files) {
  const promiseList = files.map((file) => uploadSingle(file));
  return await Promise.all(promiseList);
}
module.exports = {
  uploadArray,
  uploadSingle,
};
