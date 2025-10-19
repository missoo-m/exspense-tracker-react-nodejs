const mongoose = require('mongoose');

// Схема для хранения курсов валют, заполняемых вручную
const CurrencySchema = new mongoose.Schema({
    // Базовая валюта (BYN), гарантирует, что будет только один документ
    baseCurrency: {
        type: String,
        required: true,
        default: 'BYN',
        unique: true, 
    },
    // Объект, хранящий курсы (например, { USD: 3.25, EUR: 3.45 })
    rates: {
        type: Object,
        of: Number,
        required: true,
    },
    // Источник данных
    source: {
        type: String,
        default: 'Manual Entry',
    }
}, { timestamps: true }); // timestamps добавит createdAt и updatedAt

module.exports = mongoose.model('Currency', CurrencySchema);