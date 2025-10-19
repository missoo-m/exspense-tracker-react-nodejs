const User = require("../models/User");
const News = require("../models/News"); // Будет новая модель
const Currency = require('../models/Currency');

// Получить список всех пользователей
exports.getAllUsers = async (req, res) => {
    try {
        // Исключаем поле password
        const users = await User.find().select("-password"); 
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Server Error during fetching users" });
    }
};

// Удалить пользователя
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

// --- Функции для управления новостями/курсами валют ---

// Добавить новость/курс валют
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
            authorId: req.user.id, // ID администратора
        });

        await newPost.save();
        res.status(200).json(newPost);
    } catch (error) {
        res.status(500).json({ message: "Server Error during adding news", error });
    }
};

// Получить все новости/курсы (для панели управления)
exports.getAllContent = async (req, res) => {
    try {
        const content = await News.find().sort({ date: -1 });
        res.json(content);
    } catch (error) {
        res.status(500).json({ message: "Server Error during fetching content" });
    }
};

// -----------------------------------------------------------
// 🔥 НОВАЯ ФУНКЦИЯ: Обновить новость
// -----------------------------------------------------------
exports.updateNews = async (req, res) => {
    try {
        const { id } = req.params;
        // Извлекаем поля, которые можно редактировать
        const { title, content, type } = req.body;

        // Создаем объект обновлений, добавляя текущее время в поле date/updatedAt
        const updates = { 
            title, 
            content, 
            type, 
            date: Date.now() 
        };

        const updatedNews = await News.findByIdAndUpdate(
            id,
            updates,
            // { new: true } возвращает обновленный документ; { runValidators: true } проверяет схему
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

// -----------------------------------------------------------
// 🔥 НОВАЯ ФУНКЦИЯ: Удалить новость
// -----------------------------------------------------------
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
// -----------------------------------------------------------
// 1. Получить текущие курсы (для отображения в админке)
// -----------------------------------------------------------
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

// -----------------------------------------------------------
// 2. Обновить или создать курсы (заполняется админом)
// -----------------------------------------------------------
// controllers/adminController.js

// 2. Обновить или создать курсы (заполняется админом)
exports.updateCurrencyRates = async (req, res) => {
    const { rates } = req.body;

    if (!rates || typeof rates !== 'object' || Object.keys(rates).length === 0) {
        return res.status(400).json({ message: "Invalid or missing rates data." });
    }
    
    // 1. Создаем объект для динамического точечного обновления с использованием точечной нотации.
    // Пример: { 'rates.USD': 3.28, 'rates.EUR': 3.45 }
    const setOperations = {};
    for (const currencyCode in rates) {
        // Проверяем, что значение является числом, прежде чем добавлять его в операцию обновления
        if (typeof rates[currencyCode] === 'number') { 
            setOperations[`rates.${currencyCode}`] = rates[currencyCode];
        }
    }

    if (Object.keys(setOperations).length === 0) {
        return res.status(400).json({ message: "No valid number rates provided for update." });
    }
    
    // Добавляем обновление поля source и updatedAt
    setOperations['source'] = 'Manual Entry';

    try {
        const updatedRates = await Currency.findOneAndUpdate(
            { baseCurrency: 'BYN' },
            // 🔥 Используем $set для точечного обновления rates и source
            { $set: setOperations }, 
            { new: true, upsert: true } // new: true - вернуть обновленный документ; upsert: true - создать, если не найден
        );

        // Убираем __v, _id и baseCurrency из ответа для чистоты
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
        
        // 🔥 ВРЕМЕННОЕ ИЗМЕНЕНИЕ: Включаем details для отладки
        res.status(500).json({ 
            message: "Server error updating currency rates.", 
            details: error.message // Возвращаем сообщение об ошибке
   });
    }
};
// Добавьте сюда другие существующие функции adminController