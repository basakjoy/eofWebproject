"use client";

import { useState } from "react";
import { Sidebar } from "@/components/common/Sidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import styles from "./admin.module.css";


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={styles.adminRoot}>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed inset-y-0 left-0 z-40 lg:hidden">
            <Sidebar
              collapsed={false}
              onToggle={() => setSidebarOpen(false)}
            />
          </div>
        </>
      )}

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* New Admin Header (Profile & Search) */}
        <AdminHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        {/* Page Content */}
        <main className={styles.pageContent}>
          {children}
        </main>
      </div>
    </div>
  );
}
