const express = require("express");
const router = express.Router();
const publicContentController = require("../controllers/publicContentController");

// Публичный маршрут для новостей
router.get("/news", publicContentController.getPublicNews);

// Публичный маршрут для курсов валют
router.get("/currencies", publicContentController.getCurrentCurrencies);

module.exports = router;