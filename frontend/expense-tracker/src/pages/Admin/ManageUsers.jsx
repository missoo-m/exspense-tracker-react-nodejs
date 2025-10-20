
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useUserAuth } from "../../hooks/useUserAuth";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { LuTrash2 } from "react-icons/lu";
import Modal from "../../components/Modal";
import DeleteAlert from "../../components/DeleteAlert";

const ManageUsers = () => {
    useUserAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDeleteAlert, setOpenDeleteAlert] = useState({
        show: false,
        data: null,
    })

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(API_PATHS.ADMIN.GET_ALL_USERS);
            setUsers(response.data);
        } catch (error) {
            toast.error("Failed to load users.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (userId) => {
        try {
            await axiosInstance.delete(API_PATHS.ADMIN.DELETE_USER(userId));

            setOpenDeleteAlert({ show: false, data: null });
            toast.success("User details deleted successfully");
            fetchIncomeDetails();
        } catch (error) {
            console.error(
                "Error deleting user:",
                error.response?.data?.message || error.message
            );
        }
    };




    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <DashboardLayout activeMenu="Manage Users">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Управление пользователями</h2>

            {loading ? (
                <div className="p-6 bg-white rounded-xl shadow-lg">
                    <p className="text-center text-gray-500">Загрузка...</p>
                </div>
            ) : (
                <div
                    className="
            p-6 bg-white rounded-2xl 
            shadow-[0px_10px_30px_rgba(251,111,146,0.12)] 
            overflow-x-auto border border-[#ffe5ec]
        "
                >
                    <table className="min-w-full divide-y divide-[#ffb3c6]">

                        <thead className="bg-[#ffe5ec] rounded-t-2xl">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-[#e11d48] uppercase tracking-wider">Полное имя</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-[#e11d48] uppercase tracking-wider">Email</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-[#e11d48] uppercase tracking-wider">Роль</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-[#e11d48] uppercase tracking-wider">Действия</th>
                            </tr>
                        </thead>

                        <tbody className="bg-white divide-y divide-gray-100">
                            {users.map((user) => (
                                <tr key={user._id} className="hover:bg-[#fff7f8] transition duration-150">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{user.fullName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`
                                px-3 py-1 text-xs font-semibold rounded-full 
                                ${user.role === 'ADMIN'
                                                ? 'bg-[#ffc2d1] text-[#e11d48]' 
                                                : 'bg-green-100 text-green-600' 
                                            }
                            `}>
                                            {user.role}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => setOpenDeleteAlert({ show: true, data: user._id })}
                                            className={`
                                    p-2 rounded-full 
                                    transition duration-200
                                    ${user.role === 'ADMIN'
                                                    ? 'text-gray-400 cursor-not-allowed'
                                                    : 'text-gray-400 bg-white hover:bg-white hover:text-red-500' 
                                                }
                                `}
                                            disabled={user.role === 'ADMIN'}
                                            title={user.role === 'ADMIN' ? 'Нельзя удалить администратора' : 'Удалить пользователя'}
                                        >
                                            <LuTrash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Modal
                        isOpen={openDeleteAlert.show}
                        onClose={() => setOpenDeleteAlert({ show: false, data: null })}
                        title="Удалить пользователя"
                    >
                        <DeleteAlert
                            content={`Вы уверены, что хотите удалить пользователя?`}
                            onDelete={() => handleDelete(openDeleteAlert.data)}
                        />
                    </Modal>
                </div>
            )}


        </DashboardLayout>
    );
};

export default ManageUsers;