const User = require("../models/User");
const News = require("../models/News"); 
const Currency = require('../models/Currency');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password"); 
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Server Error during fetching users" });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error during deleting user" });
    }
};

exports.addNews = async (req, res) => {
    try {
        const { title, content, type } = req.body; // type: 'news' или 'currency'

        if (!title || !content || !type) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newPost = new News({
            title,
            content,
            type,
            authorId: req.user.id, 
        });

        await newPost.save();
        res.status(200).json(newPost);
    } catch (error) {
        res.status(500).json({ message: "Server Error during adding news", error });
    }
};

exports.getAllContent = async (req, res) => {
    try {
        const content = await News.find().sort({ date: -1 });
        res.json(content);
    } catch (error) {
        res.status(500).json({ message: "Server Error during fetching content" });
    }
};

exports.updateNews = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, type } = req.body;
        const updates = { 
            title, 
            content, 
            type, 
            date: Date.now() 
        };

        const updatedNews = await News.findByIdAndUpdate(
            id,
            updates,
            { new: true, runValidators: true } 
        );

        if (!updatedNews) {
            return res.status(404).json({ message: "News item not found." });
        }

        res.status(200).json(updatedNews);
    } catch (error) {
        console.error("Server Error during updating news:", error);
        res.status(500).json({ message: "Server Error during updating news", error });
    }
};

exports.deleteNews = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedNews = await News.findByIdAndDelete(id);

        if (!deletedNews) {
            return res.status(404).json({ message: "News item not found." });
        }

        res.status(200).json({ message: "News item deleted successfully." });
    } catch (error) {
        console.error("Server Error during deleting news:", error);
        res.status(500).json({ message: "Server Error during deleting news", error });
    }
};
exports.getCurrencyRates = async (req, res) => {
    try {
        const rates = await Currency.findOne({ baseCurrency: 'BYN' }).select('-baseCurrency -source -_id -__v');

        if (!rates) {
            return res.status(200).json({ rates: {}, updatedAt: null });
        }

        res.status(200).json(rates);
    } catch (error) {
        console.error("Error fetching currency rates for admin:", error.message);
        res.status(500).json({ message: "Server error retrieving currency rates." });
    }
};

exports.updateCurrencyRates = async (req, res) => {
    const { rates } = req.body;

    if (!rates || typeof rates !== 'object' || Object.keys(rates).length === 0) {
        return res.status(400).json({ message: "Invalid or missing rates data." });
    }
    
    const setOperations = {};
    for (const currencyCode in rates) {
        if (typeof rates[currencyCode] === 'number') { 
            setOperations[`rates.${currencyCode}`] = rates[currencyCode];
        }
    }

    if (Object.keys(setOperations).length === 0) {
        return res.status(400).json({ message: "No valid number rates provided for update." });
    }
    
    setOperations['source'] = 'Manual Entry';

    try {
        const updatedRates = await Currency.findOneAndUpdate(
            { baseCurrency: 'BYN' },
            { $set: setOperations }, 
            { new: true, upsert: true } 
        );

        const responseData = updatedRates.toObject();
        delete responseData.__v;
        delete responseData._id;
        delete responseData.baseCurrency;

        res.status(200).json({ 
            message: "Currency rates updated successfully (partial update).",
            data: responseData 
        });

    } catch (error) {
        console.error("Error updating currency rates by admin:", error.message);
        
        res.status(500).json({ 
            message: "Server error updating currency rates.", 
            details: error.message 
   });
    }
};