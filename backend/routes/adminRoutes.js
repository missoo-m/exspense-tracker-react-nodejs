const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { adminProtect } = require("../middleware/adminMiddleware"); 
const adminController = require("../controllers/adminController");
const publicContentController = require("../controllers/publicContentController"); 

const {
    updateCurrencyRates,
    getCurrencyRates
} = require("../controllers/adminController");


router.get('/currency', protect, getCurrencyRates);

router.put('/currency', protect, updateCurrencyRates);

router.get("/users", protect, adminProtect, adminController.getAllUsers);

router.delete("/users/:id", protect, adminProtect, adminController.deleteUser);

router.post("/content", protect, adminProtect, adminController.addNews);

router.get("/content/admin", protect, adminProtect, adminController.getAllContent); 

router.put("/content/:id", protect, adminProtect, adminController.updateNews); 

router.delete("/content/:id", protect, adminProtect, adminController.deleteNews);

module.exports = router;