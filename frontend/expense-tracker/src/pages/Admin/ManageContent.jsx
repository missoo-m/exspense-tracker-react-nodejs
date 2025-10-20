// pages/Admin/ManageContent.jsx

import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useUserAuth } from "../../hooks/useUserAuth";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { LuTrash2, LuPlus, LuPencil, LuChevronDown } from "react-icons/lu";
import Modal from "../../components/Modal";
import DeleteAlert from "../../components/DeleteAlert";

const ManageContent = () => {
    useUserAuth();
    const [contentList, setContentList] = useState([]);
    const [loading, setLoading] = useState(true);

    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({});

    const [newContent, setNewContent] = useState({
        type: 'news',
        title: '',
        content: '',
        currencyRates: { USD: '', EUR: '', RUB: '', YEN: "" },
    });

    const [openDeleteAlert, setOpenDeleteAlert] = useState({
        show: false,
        data: null,
    });

    const fetchContent = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(API_PATHS.ADMIN.GET_ALL_CONTENT);
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

    const handleEditClick = (item) => {
        setEditingItem(item);
        setFormData({
            title: item.title || '',
            content: item.content || '',
            type: item.type
        });
    };

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!editingItem) return;

        if (formData.type === 'news' && (!formData.title || !formData.content)) {
            toast.error("Title and content are required for news.");
            return;
        }

        let dataToSend = formData;
        let updatePath = API_PATHS.ADMIN.UPDATE_CONTENT(editingItem._id);

        if (formData.type === 'currency') {
            toast.error("Currency rates should be updated via the dedicated form (Add New Content).");
            return;
        }

        try {
            await axiosInstance.put(updatePath, dataToSend);

            toast.success("Элемент контента успешно обновлен.");
            setEditingItem(null);
            fetchContent();
        } catch (error) {
            toast.error(error.response?.data?.message || "Ошибка при обновлении контента.");
            console.error("Update Content Error:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axiosInstance.delete(API_PATHS.ADMIN.DELETE_CONTENT(id));

            setOpenDeleteAlert({ show: false, data: null });
            toast.success("Content details deleted successfully");
            fetchContent();
        } catch (error) {
            console.error(
                "Error deleting content:",
                error.response?.data?.message || error.message
            );
        }
    };

    const handleCurrencyRateChange = (code, value) => {
        const cleanedValue = value.replace(/[^0-9.]/g, '');

        setNewContent((prev) => ({
            ...prev,
            currencyRates: {
                ...prev.currencyRates,
                [code]: cleanedValue,
            },
        }));
    };

    const handleAddContent = async (e) => {
        e.preventDefault();
        if (newContent.type === 'news' && (!newContent.title || !newContent.content)) {
            toast.error("Title and content are required for news.");
            return;
        }
        if (newContent.type === 'currency') {
            const hasRates = Object.values(newContent.currencyRates).some(rate => rate !== '');
            if (!hasRates) {
                toast.error("At least one currency rate is required.");
                return;
            }
        }

        try {
            if (newContent.type === 'currency') {
                const ratesObject = Object.entries(newContent.currencyRates)
                    .filter(([code, rate]) => rate !== '')
                    .reduce((acc, [code, rate]) => {

                        acc[code] = parseFloat(rate);
                        return acc;
                    }, {});

                const dataToSend = {
                    rates: ratesObject
                };

                await axiosInstance.put(API_PATHS.ADMIN.UPDATE_CURRENCIES, dataToSend);
                toast.success("Currency rates updated successfully!");

            } else {
                const dataToSend = {
                    type: 'news',
                    title: newContent.title,
                    content: newContent.content,
                };

                await axiosInstance.post(API_PATHS.ADMIN.ADD_CONTENT, dataToSend);
                toast.success("News content added!");
            }

            setNewContent({
                type: 'news',
                title: '',
                content: '',
                currencyRates: { USD: '', EUR: '', RUB: '', YEN: "" },
            });
            fetchContent();

        } catch (error) {
            let errorMessage = "Failed to add content.";
            if (newContent.type === 'currency' && error instanceof SyntaxError) {
                errorMessage = "Invalid ввод format for currency rates.";
            } else {
                errorMessage = error.response?.data?.message || errorMessage;
            }
            toast.error(errorMessage);
        }
    };

    useEffect(() => {
        fetchContent();
    }, []);

    const formatContentPreview = (item) => {
        if (item.type === 'currency') {
            try {
                const parsedContent = JSON.parse(item.content);
                const keys = Object.keys(parsedContent);
                return `Курсы: ${keys.slice(0, 3).join(', ')}... (${keys.length} всего)`;
            } catch (e) {
                return 'Некорректный ввод (пожалуйста, обновите курсы)';
            }
        }
        return item.content.substring(0, 150) + (item.content.length > 150 ? '...' : '');
    };

    return (
        <DashboardLayout activeMenu="Manage Content">

            <h2 className="text-2xl font-bold text-gray-800 mb-6">Управление публичным контентом</h2>
            <div className="mb-8 p-8 bg-white rounded-3xl 
        shadow-[0px_10px_30px_rgba(251,111,146,0.12),_0px_0px_0px_rgba(255,255,255,1)] 
        transition-all duration-500">

                <form onSubmit={handleAddContent}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="md:col-span-1">
                            <label className="text-sm font-medium text-slate-600 mb-1 block">Тип контента</label>
                            <div
                                className="
    w-full p-0 flex items-center 
    rounded-full shadow-inner bg-white border border-gray-200
    transition-all duration-300 
    focus-within:ring-4 focus-within:ring-[#ffe5ec] focus-within:border-[#ffb3c6]
"
                            >
                                <span className="text-[#ff8fab] rounded-full px-4 py-2">
                                    <LuChevronDown size={20} />
                                </span>

                                <select
                                    name="type"
                                    value={newContent.type}
                                    onChange={handleInputChange}
                                    className="
                                        w-full bg-transparent outline-none 
                                        py-2 pr-4 text-base cursor-pointer appearance-none
                                    "
                                >
                                    <option value="news">Новость</option>
                                    <option value="currency">Курсы валют</option>
                                </select>
                            </div>
                        </div>

                        {newContent.type === 'news' && (
                            <div className="md:col-span-2">
                                <label className="text-sm font-medium text-slate-600 mb-1 block">Заголовок</label>

                                <div
                                    className="
    w-full p-0 flex items-center 
    rounded-full shadow-inner bg-white border border-gray-200
    transition-all duration-300 
    focus-within:ring-4 focus-within:ring-[#ffe5ec] focus-within:border-[#ffb3c6]
"
                                >
                                    <span className="text-[#ff8fab] rounded-full px-4 py-2">
                                        <LuPencil size={20} />
                                    </span>

                                    <input
                                        name="title"
                                        value={newContent.title}
                                        onChange={handleInputChange}
                                        placeholder="Введите заголовок новости"
                                        type="text"
                                        className="
                                            w-full bg-transparent outline-none 
                                            py-2 pr-4 text-base 
                                        "
                                    />
                                </div>
                            </div>
                        )}

                    </div>

                    <div className="mb-4">
                        {newContent.type === 'currency' ? (
                            <div>
                                <h4 className="text-lg font-bold text-slate-700 mb-4">Установите курсы валют</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {Object.entries(newContent.currencyRates).map(([code, rate]) => (
                                        <div key={code}>
                                            <label className="text-sm font-medium text-slate-600 mb-1 block">{code}</label>

                                            <div
                                                className="
    w-full p-0 flex items-center 
    rounded-full shadow-inner bg-white border border-gray-200
    transition-all duration-300 
    focus-within:ring-4 focus-within:ring-[#ffe5ec] focus-within:border-[#ffb3c6]
"
                                            >
                                                <span className="text-white font-bold text-sm bg-[#ff8fab] rounded-full px-4 py-2">
                                                    {code}
                                                </span>

                                                <input
                                                    type="text"
                                                    placeholder="0.00"
                                                    value={rate}
                                                    onChange={(e) => handleCurrencyRateChange(code, e.target.value)}
                                                    className="
                            w-full bg-transparent outline-none 
                            py-2 px-3 text-base 
                        "
                                                />
                                            </div>

                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <>
                                <label className="text-sm font-medium text-slate-600 mb-1 block">
                                    Содержимое новости
                                </label>
                                <textarea
                                    name="content"
                                    value={newContent.content}
                                    onChange={handleInputChange}
                                    rows={6}
                                    placeholder='Опишите новость подробно. Используйте абзацы для лучшей читаемости.'
                                    className="
    w-full resize-y p-4 text-base 
    rounded-xl shadow-inner bg-white border border-gray-200
    focus:ring-4 focus:ring-[#ffe5ec] focus:border-[#ffb3c6]
    transition-all duration-300 h-48
"

                                />
                            </>
                        )}
                    </div>



                    <button
                        type="submit"
                        className="
        mt-6 w-full py-3 px-6 
        bg-[#fb6f92] text-white font-bold 
        rounded-full shadow-xl 
        hover:bg-[#ff8fab] hover:shadow-2xl 
        transition-all duration-300
        
        flex items-center justify-center gap-2
    "
                    >
                        <LuPlus size={18} />
                        {newContent.type === 'currency' ? 'ОБНОВИТЬ КУРС ВАЛЮТ' : 'ДОБАВИТЬ НОВОСТЬ'}
                    </button>
                </form>
            </div>

            <h3 className="text-xl font-semibold mb-4">Существующий контент ({contentList.length})</h3>

            {loading ? (
                <p>Загрузка...</p>
            ) : (
                <div className="space-y-4">
                    {contentList.map((item) => (
                        <div
                            key={item._id}
                            className="
                                p-5 bg-white rounded-xl shadow-lg 
                                flex justify-between items-start 
                                transition-all duration-300
                                hover:shadow-xl hover:scale-[1.01]
                            "
                        >
                            <div className="flex-grow">
                                <span className={`
                                    text-xs font-bold px-3 py-1 rounded-full 
                                    ${item.type === 'news'
                                        ? 'bg-[#ffe5ec] text-[#ff8fab]'
                                        : 'bg-green-100 text-green-700'
                                    } 
                                    mr-3 
                                `}>
                                    {item.type.toUpperCase()}
                                </span>

                                <h4 className="text-xl font-bold text-gray-800 mt-2">
                                    {item.title || 'Курсы валют (см. детали)'}
                                </h4>
                                <p className="text-sm text-gray-600 mt-2">
                                    {formatContentPreview(item)}
                                </p>
                                <p className="text-xs text-gray-400 mt-3">
                                    Опубликовано: {new Date(item.date).toLocaleString()}
                                </p>
                            </div>

                            <div className="flex space-x-2 shrink-0 pt-1">
                                {item.type === 'news' && (
                                    <button
                                        onClick={() => handleEditClick(item)}
                                        className="
    p-2 rounded-full text-teal-600 bg-teal-50 
    hover:bg-teal-600 hover:text-white 
    transition duration-200
"
                                        title="Редактировать новость"
                                    >
                                        <LuPencil size={20} />
                                    </button>
                                )}

                                <button
                                    onClick={() => setOpenDeleteAlert({ show: true, data: item._id })}
                                    className="
                                        p-2 rounded-full text-gray-400 bg-white-50 
                                        hover:bg-white hover:text-red-600 
                                        transition duration-200
                                    "
                                    title="Удалить контент"
                                >
                                    <LuTrash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {!contentList.length && <p className="text-gray-500 p-4 rounded-xl shadow-lg bg-white">Контент еще не был добавлен.</p>}
                </div>
            )}

            {editingItem && (
                <Modal
                    title={`Редактирование: ${editingItem.title || 'Курсы валют'}`}
                    isOpen={!!editingItem}
                    onClose={() => setEditingItem(null)}
                >
                    <form onSubmit={handleUpdate} className="space-y-4">
                        {editingItem.type === 'news' && (
                            <div>
                                <label className="text-[13px] text-slate-800">Заголовок</label>
                                <input
                                    name="title"
                                    value={formData.title}
                                    onChange={handleEditFormChange}
                                    placeholder="Введите заголовок новости"
                                    type="text"
                                    className="input-box w-full"
                                />
                            </div>
                        )}
                        <div>
                            <label className="text-[13px] text-slate-800">Содержимое</label>
                            <textarea
                                name="content"
                                value={formData.content}
                                onChange={handleEditFormChange}
                                rows={4}
                                className="input-box w-full resize-y"
                                placeholder="Введите содержимое..."
                                disabled={editingItem.type === 'currency'}
                            />
                            {editingItem.type === 'currency' && (
                                <p className="text-xs text-red-500 mt-1">
                                    Курсы валют редактируются только через форму "Добавить новый контент" (PUT-запрос).
                                </p>
                            )}
                        </div>

                        <div className="flex justify-end space-x-2">
                            <button
                                type="button"
                                onClick={() => setEditingItem(null)}
                                className="secondary-btn"
                            >
                                Отмена
                            </button>
                            <button
                                type="submit"
                                className="add-btn"
                                disabled={editingItem.type === 'currency'}
                            >
                                СОХРАНИТЬ ИЗМЕНЕНИЯ
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
            <Modal

                isOpen={openDeleteAlert.show}

                onClose={() => setOpenDeleteAlert({ show: false, data: null })}

                title="Delete элемент"

            >

                <DeleteAlert

                    content="Are you sure you want to delete this элемент deteil?"

                    onDelete={() => handleDelete(openDeleteAlert.data)}

                />

            </Modal>
        </DashboardLayout>
    );
};

export default ManageContent;