const express = require("express");
const { getCards } = require("../controllers/cardController");

const router = express.Router();

router.get("/cards", getCards);

module.exports = router;
