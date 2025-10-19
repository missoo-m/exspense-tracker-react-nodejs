// pages/Dashboard/News.jsx (Пример)
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useUserAuth } from "../../hooks/useUserAuth";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const News = () => {
    useUserAuth(); // Гарантирует, что мы аутентифицированы
    const [news, setNews] = useState([]);
    const [currencies, setCurrencies] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchContent = async () => {
        try {
            const [newsRes, currencyRes] = await Promise.all([
                axiosInstance.get(API_PATHS.PUBLIC.GET_NEWS),
                axiosInstance.get(API_PATHS.PUBLIC.GET_CURRENCIES),
            ]);
            
            setNews(newsRes.data);
            setCurrencies(currencyRes.data);
        } catch (error) {
            toast.error("Failed to load content.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContent();
    }, []);

    return (
        <DashboardLayout activeMenu="News & Currencies">
            <h2 className="text-2xl font-semibold mb-6">News & Currency Exchange Rates</h2>

            {loading ? (<p>Loading...</p>) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Блок с курсами валют (будет занимать 1/3) */}
                    <div className="card col-span-1 h-fit bg-blue-50">
                        <h3 className="text-xl font-bold mb-4 text-blue-800">Today's Exchange Rates</h3>
                        {currencies ? (
                            <>
                                <p className="text-xs text-gray-500 mb-4">Last updated: {new Date(currencies.date).toLocaleDateString()}</p>
                                {/* Предполагаем, что currencies.content содержит JSON с курсами */}
                                <pre className="bg-white p-4 rounded-lg text-sm overflow-auto">{currencies.content}</pre>
                            </>
                        ) : (
                            <p className="text-gray-600">Currency rates not available yet.</p>
                        )}
                    </div>

                    {/* Блок с новостями (будет занимать 2/3) */}
                    <div className="col-span-1 lg:col-span-2 space-y-4">
                        <h3 className="text-xl font-bold mb-4">Latest News</h3>
                        {news.length > 0 ? (
                            news.map((item) => (
                                <div key={item._id} className="card border-l-4 border-primary">
                                    <h4 className="text-lg font-semibold text-gray-800">{item.title}</h4>
                                    <p className="text-xs text-gray-500 mb-2">Published: {new Date(item.date).toLocaleDateString()}</p>
                                    <p className="text-sm text-gray-600">{item.content}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-600">No news available.</p>
                        )}
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default News;