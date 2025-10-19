// controllers/publicContentController.js

const News = require("../models/News"); 
const Currency = require('../models/Currency'); // <--- Используем эту модель

// -----------------------------------------------------------
// ✅ Оставляем этот блок (Использует модель Currency)
// -----------------------------------------------------------
exports.getCurrentCurrencies = async (req, res) => {
    try {
        // Ищем документ с курсами
        const rates = await Currency.findOne({ baseCurrency: 'BYN' }).select('rates updatedAt'); 

        if (!rates) {
            // Если документ не найден, отправляем 404
            return res.status(404).json({ message: "Currency rates not yet set by administrator." });
        }
        
        // Отправляем найденный документ. Он будет объектом, а не null.
        return res.status(200).json(rates); 
    } catch (error) {
        console.error("Server error retrieving currency rates:", error);
        return res.status(500).json({ message: "Server error retrieving currency rates." });
    }
};

// -----------------------------------------------------------
// Получить опубликованные новости (для всех пользователей/гостей)
// -----------------------------------------------------------
exports.getPublicNews = async (req, res) => {
    try {
        const news = await News.find({ type: 'news' }).sort({ date: -1 }).limit(10);
        res.json(news);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
