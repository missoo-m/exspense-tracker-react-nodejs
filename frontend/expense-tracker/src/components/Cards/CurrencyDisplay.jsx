import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { LuWallet, LuCalendar } from 'react-icons/lu';
import moment from 'moment';
// Убедитесь, что moment импортирован или используйте нативный Date

const CurrencyDisplay = ({ currencyData, loading }) => {
    
    if (!currencyData) {
         return (
             <div className="card w-full lg:w-1/3 p-4 border-l-4 border-red-500">
                <p className="text-sm text-red-500 font-medium">Курсы валют пока не установлены администратором.</p>
             </div>
         );
     }
     // 1. Проверка на loading
    if (loading) {
        return (
            <div className="card w-full lg:w-full p-4 flex items-center justify-center h-20">
                <span className="text-sm text-gray-500">Загрузка курсов...</span>
            </div>
        );
    }

    const { rates, updatedAt } = currencyData; 

    const formattedDate = moment(updatedAt).format('DD.MM.YYYY HH:mm');
    
    // Преобразуем объект rates в массив для маппинга
    const currencyEntries = Object.entries(rates);
    
    // Выводим максимум 4 валюты, чтобы не перегружать блок
    const topCurrencies = currencyEntries.slice(0, 4);

    return (
        <div className="card w-full lg:w-full p-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <LuWallet className="text-primary"/> Курсы валют (BYN)
            </h3>
            
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                {/* Итерируемся по массиву валют */}
                {topCurrencies.map(([currencyCode, rate]) => (
                    <div key={currencyCode} className="flex flex-col">
                        <span className="text-xs text-gray-500">{currencyCode}</span>
                        <span className="text-lg font-bold text-gray-900 leading-tight">
                            {rate.toFixed(4)}
                        </span>
                    </div>
                ))}
            </div>

            <p className="text-xs text-gray-400 mt-4 flex items-center justify-end gap-1 border-t pt-2">
                <LuCalendar size={12}/> Обновлено: {formattedDate}
            </p>
        </div>
    );
};

export default CurrencyDisplay;