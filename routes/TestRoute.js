const parser = require("../middlewares/Parser");

const router = require("express").Router();

router.get(
  "/",
  parser.fields([{ name: "test" }, { name: "ye" }, { name: "video" }]),
  async (req, res) => {
    try {
      console.log(req.file);
      console.log(req.files);
      return res.status(200).json({ message: "ko co gi" });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: error.message });
    }
  }
);

module.exports = router;
