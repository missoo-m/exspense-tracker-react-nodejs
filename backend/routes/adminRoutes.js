const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { adminProtect } = require("../middleware/adminMiddleware"); // Новый middleware
const adminController = require("../controllers/adminController");
const publicContentController = require("../controllers/publicContentController"); // Нужен для публичных маршрутов
// Импортируем функции из контроллера
const {
    // ... другие функции админа
    updateCurrencyRates,
    getCurrencyRates
} = require("../controllers/adminController");

// --- Маршруты для управления курсами валют ---

// [GET] Получить курсы для админ-панели
router.get('/currency', protect, getCurrencyRates);

// [PUT] Обновить курсы (админ заполняет)
router.put('/currency', protect, updateCurrencyRates);
// Маршруты для управления пользователями (только для ADMIN)
// Сначала protect (аутентификация), затем adminProtect (авторизация)
router.get("/users", protect, adminProtect, adminController.getAllUsers);
router.delete("/users/:id", protect, adminProtect, adminController.deleteUser);

// Маршруты для управления контентом (только для ADMIN)
router.post("/content", protect, adminProtect, adminController.addNews);
router.get("/content/admin", protect, adminProtect, adminController.getAllContent); // Для админки

// [PUT] Отредактировать новость по ID
router.put("/content/:id", protect, adminProtect, adminController.updateNews); 

// [DELETE] Удалить новость по ID
router.delete("/content/:id", protect, adminProtect, adminController.deleteNews);

module.exports = router;