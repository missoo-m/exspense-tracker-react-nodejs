export const BASE_URL = "http://localhost:8000";

//utils/apiPaths.js
export const API_PATHS ={
    AUTH: {
        LOGIN: "/api/v1/auth/login",
        REGISTER: "/api/v1/auth/register",
        GET_USER_INFO: "/api/v1/auth/getUser",
        UPDATE: "/api/v1/auth/update",

    },

// НОВЫЕ ПУТИ ДЛЯ АДМИНА И ПУБЛИЧНОГО КОНТЕНТА
    ADMIN: {
        GET_ALL_USERS: "/api/v1/admin/users",
        DELETE_USER: (userId) => `/api/v1/admin/users/${userId}`,
        ADD_CONTENT: "/api/v1/admin/content", // для новостей/курсов
        GET_ALL_CONTENT: "/api/v1/admin/content/admin", // для админ-панели
        // 🔥 ДОБАВИТЬ ЭТОТ ПУТЬ
        UPDATE_CURRENCIES: "/api/v1/admin/currency",
        // НОВЫЕ ПУТИ ДЛЯ РЕДАКТИРОВАНИЯ И УДАЛЕНИЯ КОНТЕНТА
        UPDATE_CONTENT: (id) => `/api/v1/admin/content/${id}`, 
        DELETE_CONTENT: (id) => `/api/v1/admin/content/${id}`,
    },
    PUBLIC: {
        GET_NEWS: "/api/v1/public/news",
        GET_CURRENCIES: "/api/v1/public/currencies",
    },



    DASHBOARD:{
        GET_DATA: "/api/v1/dashboard",
    },
    INCOME: {
        ADD_INCOME: "/api/v1/income/add",
        GET_ALL_INCOME: "/api/v1/income/get",
        DELETE_INCOME: (incomeId) => `/api/v1/income/${incomeId}`,
        DOWNLOAD_INCOME: `/api/v1/income/downloadexcel`,
    },
    EXPENSE:{
        ADD_EXPENSE:"/api/v1/expense/add",
        GET_ALL_EXPENSE: "/api/v1/expense/get",
        DELETE_EXPENSE: (expenseId) => `/api/v1/expense/${expenseId}`,
        DOWNLOAD_EXPENSE: `/api/v1/expense/downloadexcel`,
    },
    IMAGE: {
        UPLOAD_IMAGE: "/api/v1/auth/upload-image",
    }
}