const News = require("../models/News"); 

// Получить опубликованные новости (для всех пользователей/гостей)
exports.getPublicNews = async (req, res) => {
    try {
        const news = await News.find({ type: 'news' }).sort({ date: -1 }).limit(10);
        res.json(news);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// Получить текущий курс валют (для всех пользователей/гостей)
exports.getCurrentCurrencies = async (req, res) => {
    try {
        // Находим самый свежий пост с типом 'currency'
        const currency = await News.findOne({ type: 'currency' }).sort({ date: -1 }); 
        res.json(currency);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};