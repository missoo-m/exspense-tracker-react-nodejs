

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import Home from "./pages/Dashboard/Home";
import Income from "./pages/Dashboard/Income";
import Expense from "./pages/Dashboard/Expense";
import UserProvider from "./context/userContext";
import Profile from "./pages/Dashboard/Profile";
import {Toaster} from 'react-hot-toast';
import AdminRoute from "./components/auth/AdminRoute"; 
import ManageUsers from "./pages/Admin/ManageUsers"; 
import ManageContent from "./pages/Admin/ManageContent"; 
import News from "./pages/Dashboard/News"; 


const App =() =>{
  return (
    <UserProvider>
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Root />}/>
          <Route path="/login" element={<Login />}/>
          <Route path="/signUp" element={<SignUp />}/>
          <Route path="/dashboard" element={<Home />}/> 
          <Route path="/income" element={<Income />}/>
          <Route path="/expense" element={<Expense />}/>
          <Route path="/profile-edit" element={<Profile />}/>
          <Route path="/news" element={<News />}/>
          <Route path="/admin/users" element={
            <AdminRoute>
              <ManageUsers />
            </AdminRoute>
          }/>
          <Route path="/admin/content" element={
            <AdminRoute>
              <ManageContent />
            </AdminRoute>
          }/>
          
        </Routes>
      </Router>
    </div>

    <Toaster
    toastOptions={{
      className: "",
      style: {
        fontSize:'13px'
      },
    }}
    />
    </UserProvider>
  )
}
export default App

const Root =() =>{

  const isAuthenticated =!!localStorage.getItem("token");

  return isAuthenticated ? (
    <Navigate to="/dashboard" />
  ) :(
    <Navigate to="/login" />
  );
};