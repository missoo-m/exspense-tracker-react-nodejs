// pages/Admin/ManageContent.jsx

import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useUserAuth } from "../../hooks/useUserAuth";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { LuTrash2, LuPlus } from "react-icons/lu";
import Input from "../../components/Inputs/Input"; // Используем ваш компонент Input

const ManageContent = () => {
    useUserAuth();
    const [contentList, setContentList] = useState([]);
    const [loading, setLoading] = useState(true);

    // Состояние для новой записи контента
    const [newContent, setNewContent] = useState({
        type: 'news', // 'news' или 'currency'
        title: '',    // Заголовок (только для новостей)
        content: '',  // Тело контента (текст новости или JSON для валют)
    });

    const fetchContent = async () => {
        try {
            setLoading(true);
            // Используем специальный маршрут для получения всего контента в админ-панели
            const response = await axiosInstance.get(API_PATHS.ADMIN.GET_ALL_CONTENT);
            // Сортируем по дате, чтобы новые были сверху
            const sortedContent = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
            setContentList(sortedContent);
        } catch (error) {
            toast.error("Failed to load content.");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewContent((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddContent = async (e) => {
        e.preventDefault();

        // Базовая валидация
        if (newContent.type === 'news' && (!newContent.title || !newContent.content)) {
            toast.error("Title and content are required for news.");
            return;
        }
        if (newContent.type === 'currency' && !newContent.content) {
            toast.error("Content (JSON) is required for currency rates.");
            return;
        }

        try {
            const dataToSend = {
                type: newContent.type,
                title: newContent.type === 'news' ? newContent.title : undefined,
                content: newContent.content,
            };

            await axiosInstance.post(API_PATHS.ADMIN.ADD_CONTENT, dataToSend);
            toast.success(`${newContent.type === 'news' ? 'News' : 'Currency'} content added!`);
            
            // Сброс формы и обновление списка
            setNewContent({ type: 'news', title: '', content: '' });
            fetchContent();
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to add content.";
            toast.error(errorMessage);
        }
    };

    const handleDelete = async (contentId) => {
        if (!window.confirm("Are you sure you want to delete this content?")) return;
        
        try {
            // Предполагаем, что DELETE_USER можно использовать для контента, 
            // так как это гибкий маршрут удаления по ID в админ-панели.
            // Если на бэкенде есть отдельный маршрут для удаления контента, используйте его.
            await axiosInstance.delete(API_PATHS.ADMIN.DELETE_USER(contentId)); 
            toast.success("Content deleted successfully!");
            fetchContent();
        } catch (error) {
            toast.error("Failed to delete content.");
        }
    };

    useEffect(() => {
        fetchContent();
    }, []);

    const formatContentPreview = (item) => {
        if (item.type === 'currency') {
            try {
                const parsedContent = JSON.parse(item.content);
                return `Rates: ${Object.keys(parsedContent).join(', ')}`;
            } catch (e) {
                return 'Invalid JSON content';
            }
        }
        // Ограничение длины для новостей
        return item.content.substring(0, 150) + (item.content.length > 150 ? '...' : '');
    };

    return (
        <DashboardLayout activeMenu="Manage Content">
            <h2 className="text-2xl font-semibold mb-6">Manage Public Content</h2>

            {/* Секция добавления нового контента */}
            <div className="card mb-8">
                <h3 className="text-xl font-medium mb-4">Add New Content</h3>
                <form onSubmit={handleAddContent}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        {/* Выбор типа контента */}
                        <div className="md:col-span-1">
                            <label className="text-[13px] text-slate-800">Content Type</label>
                            <select 
                                name="type"
                                value={newContent.type}
                                onChange={handleInputChange}
                                className="input-box bg-white cursor-pointer" // Стили InputBox для селекта
                            >
                                <option value="news">News Article</option>
                                <option value="currency">Currency Rates (JSON)</option>
                            </select>
                        </div>
                        
                        {/* Поле для заголовка (только для новостей) */}
                        {newContent.type === 'news' && (
                            <div className="md:col-span-2">
                                <Input
                                    value={newContent.title}
                                    onChange={(e) => setNewContent(prev => ({ ...prev, title: e.target.value }))}
                                    label="Title"
                                    placeholder="Enter news title"
                                    type="text"
                                />
                            </div>
                        )}

                    </div>
                    
                    {/* Поле для содержимого */}
                    <div className="mb-4">
                        <label className="text-[13px] text-slate-800">
                            Content ({newContent.type === 'currency' ? 'JSON format required' : 'Text'})
                        </label>
                        <textarea
                            name="content"
                            value={newContent.content}
                            onChange={handleInputChange}
                            rows={newContent.type === 'currency' ? 5 : 3}
                            className="input-box w-full resize-y" // Используем стили input-box для textarea
                            placeholder={newContent.type === 'currency' ? 
                                '{ "USD_TO_EUR": 0.92, "EUR_TO_USD": 1.08 }' : 
                                'Enter news content...'}
                        />
                    </div>

                    <button type="submit" className="add-btn add-btn-fill">
                        <LuPlus size={18} />
                        ADD CONTENT
                    </button>
                </form>
            </div>

            {/* Секция списка существующего контента */}
            <h3 className="text-xl font-semibold mb-4">Existing Content ({contentList.length})</h3>
            
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="space-y-4">
                    {contentList.map((item) => (
                        <div key={item._id} className="card flex justify-between items-start">
                            <div>
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                                    item.type === 'news' ? 'bg-primary/10 text-primary' : 'bg-green-100 text-green-700'
                                } mr-2`}>
                                    {item.type.toUpperCase()}
                                </span>
                                
                                <h4 className="text-lg font-medium text-gray-900 mt-1">
                                    {item.title || 'Currency Rates'}
                                </h4>
                                <p className="text-sm text-gray-600 mt-1">
                                    {formatContentPreview(item)}
                                </p>
                                <p className="text-xs text-gray-400 mt-2">
                                    Date: {new Date(item.date).toLocaleString()}
                                </p>
                            </div>
                            
                            <button 
                                onClick={() => handleDelete(item._id)}
                                className="p-2 rounded-full text-gray-500 hover:text-red-500 hover:bg-red-50"
                            >
                                <LuTrash2 size={20} />
                            </button>
                        </div>
                    ))}
                    {!contentList.length && <p className="text-gray-500">No content has been added yet.</p>}
                </div>
            )}
        </DashboardLayout>
    );
};

export default ManageContent;