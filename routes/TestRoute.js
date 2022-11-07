const router = require("express").Router();
const Test = require("../models/Test");

router.get("/", async (req, res) => {
  try {
    const test = new Test();
    test.testName = "women";
    await test.save();
    return res.status(200).json({ message: "Success" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Failed" });
  }
});

module.exports = router;
