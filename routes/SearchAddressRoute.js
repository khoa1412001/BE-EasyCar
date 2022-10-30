const express = require("express");
const router = express.Router();
const searchAddressController = require("../controllers/SearchAddressController");
/**
 * @swagger
 * /api/search-address/:
 *    get:
 *     tags:
 *      - Search Address
 *     summary: getAddress
 *     produces:
 *       - application/json
 *     parameters:
 *      - in: query
 *        name: addr
 *        type: string
 *        required: true
 *        description: Địa chỉ
 *     responses:
 *      '200':
 *        description: OK
 */
router.get("/", searchAddressController.searchAddress);

module.exports = router;
