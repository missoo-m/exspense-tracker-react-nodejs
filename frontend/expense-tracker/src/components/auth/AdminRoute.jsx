// components/auth/AdminRoute.jsx
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../../context/userContext';
import { useUserAuth } from '../../hooks/useUserAuth'; // Используем ваш хук

const AdminRoute = ({ children }) => {
    // Этот хук гарантирует, что мы пытаемся загрузить пользователя
    useUserAuth(); 
    const { user } = useContext(UserContext);

    // Пока данные пользователя загружаются
    if (user === null) {
        // Вы можете добавить здесь спиннер или индикатор загрузки
        return <div className="p-8">Loading user data...</div>;
    }

    // Если пользователь не админ, перенаправляем на дашборд или страницу 403
    if (user.role !== 'ADMIN') {
        // Можно показать тост об ошибке доступа
        return <Navigate to="/dashboard" replace />;
    }

    // Если админ, отображаем дочерние компоненты
    return children;
};

export default AdminRoute;