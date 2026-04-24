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
    <header className={styles.header}>
      <div className={styles.leftSection}>
        <button onClick={onMenuClick} className={styles.mobileMenuBtn}>
          <Menu size={22} />
        </button>
        <span className={styles.title}>Empire of Forex</span>
        <div className={styles.searchWrapper}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search anything..."
            className={styles.searchInput}
          />
        </div>
      </div>

      <div className={styles.rightSection}>
        <button className={styles.iconBtn}>
          <Bell size={20} />
          <span className={styles.notificationBadge} />
        </button>
        
        <div className={styles.profileSection}>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{user?.name || "Admin"}</span>
            <span className={styles.userRole}>{user?.role || "Administrator"}</span>
          </div>
          <div className={styles.avatarWrapper}>
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className={styles.avatar} />
            ) : (
              <div className={styles.avatarPlaceholder}>
                <UserIcon size={20} />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
