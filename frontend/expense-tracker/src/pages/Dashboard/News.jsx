import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useUserAuth } from "../../hooks/useUserAuth";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import CurrencyDisplay from "../../components/Cards/CurrencyDisplay";
import TorchCube from "../../components/TorchCube"; 

const News = () => {
    useUserAuth(); 
    
    const [news, setNews] = useState([]);
    const [currencyData, setCurrencyData] = useState(null); 
    const [loading, setLoading] = useState(true);

    const fetchContent = async () => {
        try {
            const [newsRes, currencyRes] = await Promise.all([
                axiosInstance.get(API_PATHS.PUBLIC.GET_NEWS),
                axiosInstance.get(API_PATHS.PUBLIC.GET_CURRENCIES),
            ]);
            
            setNews(newsRes.data);
            const processedCurrencyData = { 
                ...currencyRes.data, 
                date: currencyRes.data.date || new Date().toISOString()
            };
            
            setCurrencyData(processedCurrencyData); 
            
        } catch (error) {
            if (error.response?.status === 404 && error.config.url.includes('currencies')) {
            } else {
                toast.error("Failed to load content.");
                console.error("Fetch Content Error:", error);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContent();
    }, []);

    return (
        <DashboardLayout activeMenu="News & Currencies">
            <h4 className="text-2xl font-bold text-gray-800 mb-8">Новости и Курсы валют</h4>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8"> 
            
                <div 
                    className="col-span-1 h-fit"
                >
                    <CurrencyDisplay currencyData={currencyData} loading={loading} />
                    <TorchCube />
                </div>

                <div className="col-span-1 lg:col-span-2 space-y-6"> 
                    
                    <h3 className="text-2xl font-bold text-[#ff8fab] mb-2">Последние новости</h3>
                    
                    {loading && news.length === 0 ? (
                        // 🔥 СТИЛЬ ДЛЯ ЗАГРУЗКИ
                        <div className="p-6 bg-white rounded-xl shadow-lg">
                             <p className="text-center text-gray-500">Загрузка новостей...</p>
                        </div>
                    ) : news.length > 0 ? (
                        
                        news.map((item) => (
                            <div 
                                key={item._id} 
                                className="
                                    p-6 bg-white rounded-2xl shadow-md 
                                    border-l-4 border-[#ff8fab] 
                                    transition-all duration-300
                                    hover:shadow-lg hover:translate-y-[-2px] 
                                "
                            >
                                <h4 className="text-xl font-bold text-gray-800">{item.title}</h4>
                                <p className="text-sm font-medium text-gray-500 mb-3">
                                    Опубликовано: {new Date(item.date || item.createdAt).toLocaleDateString()}
                                </p>
                                <p className="text-base text-gray-700">{item.content}</p>
                            </div>
                        ))
                        
                    ) : (
                        <p className="text-gray-600 p-6 bg-white rounded-xl shadow-lg">Нет доступных новостей.</p>
                    )}
                </div>
            </div>
            
        </DashboardLayout>
    );
};

export default News;