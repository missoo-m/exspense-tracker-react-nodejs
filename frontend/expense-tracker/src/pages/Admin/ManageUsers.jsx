// pages/Admin/ManageUsers.jsx (Пример)
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useUserAuth } from "../../hooks/useUserAuth";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { LuTrash2 } from "react-icons/lu";
import Modal from "../../components/Modal"; // 💡 Предполагаем, что у вас есть компонент Modal
import DeleteAlert from "../../components/DeleteAlert";

const ManageUsers = () => {
    useUserAuth(); // Гарантирует, что мы аутентифицированы
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
            <h2 className="text-2xl font-semibold mb-6">Manage Users</h2>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="card">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map((user) => (
                                <tr key={user._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.fullName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => setOpenDeleteAlert({ show: true, data: user._id })}
                                            className="text-red-600 hover:text-red-900"
                                            disabled={user.role === 'ADMIN'} // Защита от удаления себя или других админов
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
                        title="Delete user"
                    >
                        <DeleteAlert
                            content="Are you  sure you want to delete this user deteil?"
                            onDelete={() => deleteIncome(openDeleteAlert.data)}
                        />
                    </Modal>

                </div>
            )}
        </DashboardLayout>
    );
};

export default ManageUsers;