
const News = require("../models/News"); 
const Currency = require('../models/Currency'); 

exports.getCurrentCurrencies = async (req, res) => {
    try {
        const rates = await Currency.findOne({ baseCurrency: 'BYN' }).select('rates updatedAt'); 

        if (!rates) {
            return res.status(404).json({ message: "Currency rates not yet set by administrator." });
        }
        
        return res.status(200).json(rates); 
    } catch (error) {
        console.error("Server error retrieving currency rates:", error);
        return res.status(500).json({ message: "Server error retrieving currency rates." });
    }
};

exports.getPublicNews = async (req, res) => {
    try {
        const news = await News.find({ type: 'news' }).sort({ date: -1 }).limit(10);
        res.json(news);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
