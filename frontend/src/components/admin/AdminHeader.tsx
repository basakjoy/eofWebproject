"use client";

import React from "react";
import { Search, Bell, User as UserIcon, Menu } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import styles from "./admin-header.module.css";

interface AdminHeaderProps {
  onMenuClick?: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onMenuClick }) => {
  const { user } = useAuthStore();

  return (
    <header className={`${styles.header} glass-morphism-header`}>
      <div className={styles.leftSection}>
        <button onClick={onMenuClick} className={`${styles.mobileMenuBtn} hover:bg-white/5 p-2 rounded-lg text-slate-400 hover:text-white transition-colors`}>
          <Menu size={22} />
        </button>
        <span className={`${styles.title} font-display text-white font-bold tracking-tight hidden sm:inline-block ml-2`}>
          Empire of Forex <span className="text-purple-400">Admin</span>
        </span>
        <div className={`${styles.searchWrapper} bg-white/5 border border-white/5 rounded-xl ml-4`}>
          <Search size={18} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search anything..."
            className={`${styles.searchInput} bg-transparent text-white placeholder:text-slate-500`}
          />
          <div className="hidden md:flex items-center gap-1 bg-white/5 px-2 py-1 rounded-md border border-white/10 mr-2">
            <span className="text-[10px] text-slate-400 font-bold">SEARCH</span>
          </div>
        </div>
      </div>

      <div className={styles.rightSection}>
        <button className={`${styles.iconBtn} hover:bg-white/5 p-2 rounded-xl text-slate-400 hover:text-white transition-all relative`}>
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-purple-500 rounded-full border-2 border-[#0B0A10]" />
        </button>
        
        <div className={`${styles.profileSection} bg-white/5 border border-white/10 p-1 pl-4 rounded-2xl flex items-center gap-3`}>
          <div className={`${styles.userInfo} hidden md:flex flex-col items-end`}>
            <span className="text-xs font-bold text-white leading-tight">{user?.name || "Admin"}</span>
            <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">{user?.role || "Administrator"}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-lg shadow-purple-500/20">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-xl" />
            ) : (
              <UserIcon size={20} className="text-white" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
