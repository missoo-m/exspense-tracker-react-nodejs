const mongoose = require('mongoose');

const CurrencySchema = new mongoose.Schema({
    baseCurrency: {
        type: String,
        required: true,
        default: 'BYN',
        unique: true, 
    },
    rates: {
        type: Object,
        of: Number,
        required: true,
    },
    source: {
        type: String,
        default: 'Manual Entry',
    }
}, { timestamps: true }); 

module.exports = mongoose.model('Currency', CurrencySchema);