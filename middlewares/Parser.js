const multer = require("multer");
const storage = multer.memoryStorage();
const parser = multer({ storage: storage });

module.exports = parser;
