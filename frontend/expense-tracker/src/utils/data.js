import {
    LuLayoutDashboard ,
    LuHandCoins,
    LuWalletMinimal,
    LuLogOut,
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
    label: "Profile",
    icon: HiOutlineUser,
    path: "/profile-edit",
 },

 {
    id: "06",
    label: "LogOut",
    icon: LuLogOut,
    path: "logout",
 },
];