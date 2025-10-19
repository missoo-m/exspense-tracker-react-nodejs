const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { adminProtect } = require("../middleware/adminMiddleware"); // Новый middleware
const adminController = require("../controllers/adminController");
const publicContentController = require("../controllers/publicContentController"); // Нужен для публичных маршрутов

// Маршруты для управления пользователями (только для ADMIN)
// Сначала protect (аутентификация), затем adminProtect (авторизация)
router.get("/users", protect, adminProtect, adminController.getAllUsers);
router.delete("/users/:id", protect, adminProtect, adminController.deleteUser);

// Маршруты для управления контентом (только для ADMIN)
router.post("/content", protect, adminProtect, adminController.addNews);
router.get("/content/admin", protect, adminProtect, adminController.getAllContent); // Для админки

module.exports = router;