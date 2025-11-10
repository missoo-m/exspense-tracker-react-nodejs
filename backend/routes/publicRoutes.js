const express = require("express");
const router = express.Router();
const publicContentController = require("../controllers/publicContentController");

router.get("/news", publicContentController.getPublicNews);

router.get("/currencies", publicContentController.getCurrentCurrencies);

module.exports = router;