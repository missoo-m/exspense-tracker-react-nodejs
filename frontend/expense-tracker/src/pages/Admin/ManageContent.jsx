// pages/Admin/ManageContent.jsx

import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useUserAuth } from "../../hooks/useUserAuth";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { LuTrash2, LuPlus, LuPencil } from "react-icons/lu"; // Добавляем LuEdit
import Input from "../../components/Inputs/Input";
import Modal from "../../components/Modal"; // 💡 Предполагаем, что у вас есть компонент Modal
import DeleteAlert from "../../components/DeleteAlert";

const ManageContent = () => {
    useUserAuth();
    const [contentList, setContentList] = useState([]);
    const [loading, setLoading] = useState(true);

    // 🔥 Стейт для редактирования
    const [editingItem, setEditingItem] = useState(null); // Элемент, который сейчас редактируется
    const [formData, setFormData] = useState({});       // Данные формы редактирования


    // Состояние для новой записи контента
    const [newContent, setNewContent] = useState({
        type: 'news',
        title: '',
        content: '',
    });

    // 🔥 СТЕЙТ В ВАШЕМ ФОРМАТЕ: для подтверждения удаления контента
    const [openDeleteAlert, setOpenDeleteAlert] = useState({
        show: false,
        data: null, // Здесь будет храниться ID контента
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

    // -------------------------------------------------------------------
    // 🔥 ФУНКЦИИ РЕДАКТИРОВАНИЯ
    // -------------------------------------------------------------------

    // Открывает модальное окно и заполняет форму данными элемента
    const handleEditClick = (item) => {
        setEditingItem(item);
        setFormData({
            title: item.title || '',
            content: item.content || '',
            type: item.type
        });
    };

    // Обрабатывает изменения в форме редактирования
    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Отправка PUT-запроса на обновление
    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!editingItem) return;

        // Базовая валидация для новостей
        if (formData.type === 'news' && (!formData.title || !formData.content)) {
            toast.error("Title and content are required for news.");
            return;
        }

        // Если это новость, просто отправляем данные
        let dataToSend = formData;
        let updatePath = API_PATHS.ADMIN.UPDATE_CONTENT(editingItem._id);

        // ВНИМАНИЕ: Если вы разрешаете редактировать курсы через этот PUT-маршрут
        // ВАМ НУЖНО РЕАЛИЗОВАТЬ ЛОГИКУ ОБНОВЛЕНИЯ КУРСОВ ТУТ ИЛИ В ФУНКЦИИ handleAddContent
        if (formData.type === 'currency') {
            toast.error("Currency rates should be updated via the dedicated form (Add New Content).");
            return;
        }

        try {
            await axiosInstance.put(updatePath, dataToSend);

            toast.success("Элемент контента успешно обновлен.");
            setEditingItem(null); // Закрываем модальное окно
            fetchContent(); // Перезагружаем данные
        } catch (error) {
            toast.error(error.response?.data?.message || "Ошибка при обновлении контента.");
            console.error("Update Content Error:", error);
        }
    };

    // -------------------------------------------------------------------
    // ФУНКЦИИ УДАЛЕНИЯ
    // -------------------------------------------------------------------

    /* const handleDelete = async (id) => {
        if (!window.confirm("Вы уверены, что хотите удалить этот элемент?")) {
            return;
        }

        try {
            await axiosInstance.delete(API_PATHS.ADMIN.DELETE_CONTENT(id));

            toast.success("Элемент контента успешно удален.");
            fetchContent();
        } catch (error) {
            toast.error(error.response?.data?.message || "Ошибка при удалении контента.");
            console.error("Delete Content Error:", error);
        }
    };*/


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

    // -------------------------------------------------------------------
    // ФУНКЦИЯ ДОБАВЛЕНИЯ
    // -------------------------------------------------------------------

    const handleAddContent = async (e) => {
        e.preventDefault();

        // Валидация
        if (newContent.type === 'news' && (!newContent.title || !newContent.content)) {
            toast.error("Title and content are required for news.");
            return;
        }
        if (newContent.type === 'currency' && !newContent.content) {
            toast.error("Content (JSON) is required for currency rates.");
            return;
        }

        try {
            if (newContent.type === 'currency') {
                // ЛОГИКА ДЛЯ КУРСОВ ВАЛЮТ (PUT-запрос на специальный маршрут)
                const ratesObject = JSON.parse(newContent.content);
                const dataToSend = { rates: ratesObject };

                await axiosInstance.put(API_PATHS.ADMIN.UPDATE_CURRENCIES, dataToSend);
                toast.success("Currency rates updated successfully!");

            } else {
                // ЛОГИКА ДЛЯ НОВОСТЕЙ (POST-запрос)
                const dataToSend = {
                    type: 'news',
                    title: newContent.title,
                    content: newContent.content,
                };

                await axiosInstance.post(API_PATHS.ADMIN.ADD_CONTENT, dataToSend);
                toast.success("News content added!");
            }

            // Сброс формы и обновление списка
            setNewContent({ type: 'news', title: '', content: '' });
            fetchContent();

        } catch (error) {
            let errorMessage = "Failed to add content.";
            if (newContent.type === 'currency' && error instanceof SyntaxError) {
                errorMessage = "Invalid JSON format for currency rates.";
            } else {
                errorMessage = error.response?.data?.message || errorMessage;
            }
            toast.error(errorMessage);
        }
    };

    // -------------------------------------------------------------------
    // ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
    // -------------------------------------------------------------------

    useEffect(() => {
        fetchContent();
    }, []);

    const formatContentPreview = (item) => {
        if (item.type === 'currency') {
            try {
                // Если контент курсов хранится в модели News как JSON-строка, парсим его
                const parsedContent = JSON.parse(item.content);
                // Выводим 3 первых кода валют
                const keys = Object.keys(parsedContent);
                return `Курсы: ${keys.slice(0, 3).join(', ')}... (${keys.length} всего)`;
            } catch (e) {
                return 'Некорректный JSON (пожалуйста, обновите курсы)';
            }
        }
        return item.content.substring(0, 150) + (item.content.length > 150 ? '...' : '');
    };

    // -------------------------------------------------------------------
    // JSX РЕНДЕРИНГ
    // -------------------------------------------------------------------

    return (
        <DashboardLayout activeMenu="Manage Content">
            <h2 className="text-2xl font-semibold mb-6">Управление публичным контентом</h2>

            {/* Секция добавления нового контента */}
            <div className="card mb-8 p-6 shadow-md">
                <h3 className="text-xl font-medium mb-4">Добавить новый контент</h3>
                <form onSubmit={handleAddContent}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        {/* Выбор типа контента */}
                        <div className="md:col-span-1">
                            <label className="text-[13px] text-slate-800">Тип контента</label>
                            <select
                                name="type"
                                value={newContent.type}
                                onChange={handleInputChange}
                                className="input-box bg-white cursor-pointer"
                            >
                                <option value="news">Новость</option>
                                <option value="currency">Курсы валют (JSON)</option>
                            </select>
                        </div>

                        {/* Поле для заголовка (только для новостей) */}
                        {newContent.type === 'news' && (
                            <div className="md:col-span-2">
                                {/* 🔥 ЗАМЕНА НА СТАНДАРТНЫЙ HTML-ЭЛЕМЕНТ ДЛЯ ПЕРЕДАЧИ name */}
                                <label className="text-[13px] text-slate-800">Заголовок</label>
                                <input
                                    name="title" // <- name теперь работает
                                    value={newContent.title}
                                    onChange={handleInputChange}
                                    placeholder="Введите заголовок новости"
                                    type="text"
                                    // Используем классы вашего Input компонента для стилизации:
                                    className="input-box w-full" 
                                />
                            </div>
                        )}

                    </div>

                    {/* Поле для содержимого */}
                    <div className="mb-4">
                        <label className="text-[13px] text-slate-800">
                            Содержимое ({newContent.type === 'currency' ? 'Формат JSON' : 'Текст'})
                        </label>
                        <textarea
                            name="content"
                            value={newContent.content}
                            onChange={handleInputChange}
                            rows={newContent.type === 'currency' ? 5 : 3}
                            className="input-box w-full resize-y"
                            placeholder={newContent.type === 'currency' ?
                                '{ "USD": 3.25, "EUR": 3.50, "RUB": 0.035 }' :
                                'Введите содержимое новости...'}
                        />
                    </div>

                    <button type="submit" className="add-btn add-btn-fill flex items-center gap-1">
                        <LuPlus size={18} />
                        ДОБАВИТЬ КОНТЕНТ
                    </button>
                </form>
            </div>

            {/* Секция списка существующего контента */}
            <h3 className="text-xl font-semibold mb-4">Существующий контент ({contentList.length})</h3>

            {loading ? (
                <p>Загрузка...</p>
            ) : (
                <div className="space-y-4">
                    {contentList.map((item) => (
                        <div key={item._id} className="card flex justify-between items-start p-4 border-l-4 border-violet-400 shadow-sm">
                            <div className="flex-grow">
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${item.type === 'news' ? 'bg-primary/10 text-primary' : 'bg-green-100 text-green-700'
                                    } mr-2`}>
                                    {item.type.toUpperCase()}
                                </span>

                                <h4 className="text-lg font-medium text-gray-900 mt-1">
                                    {item.title || 'Курсы валют (см. детали)'}
                                </h4>
                                <p className="text-sm text-gray-600 mt-1">
                                    {formatContentPreview(item)}
                                </p>
                                <p className="text-xs text-gray-400 mt-2">
                                    Дата: {new Date(item.date).toLocaleString()}
                                </p>
                            </div>

                            <div className="flex space-x-2">
                                {/* Кнопка Редактировать */}
                                {item.type === 'news' && ( // Редактировать разрешаем только для новостей
                                    <button
                                        onClick={() => handleEditClick(item)}
                                        className="p-2 rounded-full text-gray-500 hover:text-blue-500 hover:bg-blue-50"
                                    >
                                        <LuPencil size={20} />
                                    </button>
                                )}

                                {/* Кнопка Удалить */}
                                <button
                                    onClick={() => setOpenDeleteAlert({ show: true, data: item._id })}
                                    className="p-2 rounded-full text-gray-500 hover:text-red-500 hover:bg-red-50"
                                >
                                    <LuTrash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {!contentList.length && <p className="text-gray-500 card p-4">Контент еще не был добавлен.</p>}
                </div>
            )}

            {/* ----------------------------------------------------------- */}
            {/* МОДАЛЬНОЕ ОКНО РЕДАКТИРОВАНИЯ */}
            {/* ----------------------------------------------------------- */}
            {editingItem && (
                <Modal
                    title={`Редактирование: ${editingItem.title || 'Курсы валют'}`}
                    isOpen={!!editingItem}
                    onClose={() => setEditingItem(null)}
                >
                    <form onSubmit={handleUpdate} className="space-y-4">
                        {/* Поле для заголовка (только для новостей) */}
                        {editingItem.type === 'news' && (
                            <div>
                                {/* 🔥 ЗАМЕНА НА СТАНДАРТНЫЙ HTML-ЭЛЕМЕНТ */}
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
                        {/* Поле для содержимого */}
                        <div>
                            <label className="text-[13px] text-slate-800">Содержимое</label>
                            <textarea
                                name="content"
                                value={formData.content}
                                onChange={handleEditFormChange}
                                rows={4}
                                className="input-box w-full resize-y"
                                placeholder="Введите содержимое..."
                                // Запрещаем редактирование содержимого, если это курсы валют
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