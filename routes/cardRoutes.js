const express = require("express");
const router = express.Router();
const cardController = require("../controllers/card");

router.route("/save_card_details").post(cardController.processCSVFiles);
router.route("/get_card_status").get(cardController.getCardStatus);

module.exports = router;
