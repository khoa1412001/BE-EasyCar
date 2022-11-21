const router = require("express").Router();

router.get("/", async (req, res) => {
  try {
    const test = false;
    if (!test) throw new Error("co phai loi~ khong");
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.message });
  }
});

module.exports = router;
