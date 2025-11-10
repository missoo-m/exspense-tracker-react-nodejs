import {
    LuLayoutDashboard ,
    LuHandCoins,
    LuWalletMinimal,
    LuLogOut,
    LuUsers,        
    LuGlobe,        
} from "react-icons/lu";
import { HiOutlineUser } from "react-icons/hi"; 

export const SIDE_MENU_DATA = [
 {
    id: "01",
    label: "Dashboard",
    icon: LuLayoutDashboard,
    path: "/dashboard",
 },
 {
    id: "02",
    label: "Income",
    icon: LuWalletMinimal,
    path: "/income",
 },
 {
    id: "03",
    label: "Expense",
    icon: LuHandCoins,
    path: "/expense",
 },

  {
    id: "04",
    label: "News & Currencies",
    icon: LuGlobe,
    path: "/news",
    role: "NORMAL", 
  },

  {
    id: "05",                
    label: "Profile",
    icon: HiOutlineUser,
    path: "/profile-edit",
 },

  {
    id: "07",
    label: "Manage Users",
    icon: LuUsers,
    path: "/admin/users",
    role: "ADMIN", 
  },
  {
    id: "08",
    label: "Manage Content",
    icon: LuGlobe,
    path: "/admin/content",
    role: "ADMIN", 
  },

 {
    id: "09",
    label: "LogOut",
    icon: LuLogOut,
    path: "logout",
 },
];