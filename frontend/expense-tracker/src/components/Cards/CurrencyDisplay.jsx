import { LuDollarSign, LuEuro, LuRussianRuble, LuJapaneseYen, LuClock } from 'react-icons/lu';

const currencyIcons = {
    USD: LuDollarSign,
    EUR: LuEuro,
    RUB: LuRussianRuble,
    YEN: LuJapaneseYen,
};
const formatUpdateDate = (dateString) => {
    if (!dateString) {
        return 'Date unknown';
    }
    const dateObj = new Date(dateString);

    if (isNaN(dateObj.getTime())) {
        return 'The date is incorrect';
    }

    return `${dateObj.toLocaleDateString()} в ${dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
};

const CurrencyDisplay = ({ currencyData, loading }) => {
    
    if (loading) {
        return (
            <div className="p-4 bg-white rounded-xl shadow-lg animate-pulse">
                <p className="text-gray-500 text-center text-sm">Downloading courses...</p>
            </div>
        );
    }

    if (!currencyData || !currencyData.rates || Object.keys(currencyData.rates).length === 0) {
        return (
            <div className="p-4 bg-white rounded-xl shadow-lg border-l-3 border-red-400">
                <p className="text-gray-600 font-medium text-sm">There are no available exchange rates to display.</p>
            </div>
        );
    }
    
    const rates = currencyData.rates;
    
    return (
        <div className="space-y-3">
            <h3 className="text-xl font-bold text-[#ff8fab] mb-4">Exchange rates</h3>
            
            {Object.entries(rates).map(([code, rate]) => {
                const IconComponent = currencyIcons[code] || LuDollarSign;
                
                return (
                    <div 
                        key={code}
                        className="
                            p-5 -> p-4, rounded-xl -> rounded-lg */
                            p-4 bg-white rounded-lg shadow-sm 
                            border-l-4 -> border-l-3 */
                            border-l-3 border-[#ff8fab] 
                            transition-all duration-300
                            hover:shadow-lg -> hover:shadow-md, -2px -> -1px */
                            hover:shadow-md hover:translate-y-[-1px]"
                    >
                        <div className="flex items-center justify-between">
                            
                            <div className="flex items-center">
                                <span className="p-1 rounded-full mr-3 bg-[#ff8fab]/10 text-[#ff8fab]">
                                    <IconComponent size={18} /> 
                                </span>
                                <span className="text-lg font-bold text-gray-800">{code}</span> 
                            </div>
                            <span className="text-xl font-extrabold text-gray-900 tracking-tight">
                                {rate.toFixed(2)}
                            </span>
                        </div>
                    </div>
                );
            })}
            <div className="flex items-center text-xs text-gray-500 mt-3 px-1.5">
                <LuClock size={14} className="mr-1" />
                <span> Updated: {formatUpdateDate(currencyData.date)}</span>
            </div>
        </div>
    );
};

export default CurrencyDisplay;