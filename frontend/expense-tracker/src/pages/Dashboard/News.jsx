import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useUserAuth } from "../../hooks/useUserAuth";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import CurrencyDisplay from "../../components/Cards/CurrencyDisplay";

const News = () => {
   // Гарантирует, что мы аутентифицированы
    useUserAuth(); 
    
    const [news, setNews] = useState([]);
    // 💡 Используем правильное имя стейта и его сеттера
    const [currencyData, setCurrencyData] = useState(null); 
    const [loading, setLoading] = useState(true);

    const fetchContent = async () => {
        try {
            const [newsRes, currencyRes] = await Promise.all([
                axiosInstance.get(API_PATHS.PUBLIC.GET_NEWS),
                axiosInstance.get(API_PATHS.PUBLIC.GET_CURRENCIES),
            ]);
            
            setNews(newsRes.data);
            // ✅ ИСПРАВЛЕНО: используем setCurrencyData
            setCurrencyData(currencyRes.data); 
            
        } catch (error) {
            // Логика обработки 404 для курсов валют, чтобы не крашить страницу
            if (error.response?.status === 404 && error.config.url.includes('currencies')) {
                setCurrencyData(null); // Если нет курсов, просто устанавливаем null
            } else {
                 // В остальных случаях показываем ошибку
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
            <h2 className="text-2xl font-semibold mb-6">Новости и Курсы валют</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Блок с курсами валют (будет занимать 1/3) */}
                <div className="col-span-1 h-fit">
                    {/* Передаем состояние загрузки и данные */}
                    <CurrencyDisplay currencyData={currencyData} loading={loading} />
                </div>

                {/* Блок с новостями (будет занимать 2/3) */}
                <div className="col-span-1 lg:col-span-2 space-y-4">
                    <h3 className="text-xl font-bold mb-4">Последние новости</h3>
                    
                    {/* Условный рендеринг новостей */}
                    {loading && news.length === 0 ? (
                        <p>Загрузка новостей...</p>
                    ) : news.length > 0 ? (
                        // 🔥 ИСПРАВЛЕНИЕ: Восстановить полный маппинг
                        news.map((item) => (
                            <div key={item._id} className="card border-l-4 border-violet-500 p-4">
                                <h4 className="text-lg font-semibold text-gray-800">{item.title}</h4>
                                {/* Используем item.createdAt или item.date в зависимости от API */}
                                <p className="text-xs text-gray-500 mb-2">Опубликовано: {new Date(item.date || item.createdAt).toLocaleDateString()}</p>
                                <p className="text-sm text-gray-600">{item.content}</p>
                            </div>
                        ))
                        // ------------------------------------------
                    ) : (
                        <p className="text-gray-600 card p-4">Нет доступных новостей.</p>
                    )}
                </div>
            </div>
            
        </DashboardLayout>
    );
};

export default News;