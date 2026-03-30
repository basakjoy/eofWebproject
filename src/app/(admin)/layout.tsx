"use client";

import { useState } from "react";
import { Sidebar } from "@/components/common/Sidebar";
import { Menu } from "lucide-react";
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
      <div className="hidden md:block">
        <Sidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-30 bg-black/50 md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed inset-y-0 left-0 z-40 md:hidden">
            <Sidebar
              collapsed={false}
              onToggle={() => setSidebarOpen(false)}
            />
          </div>
        </>
      )}

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Mobile Header */}
        <header className={styles.mobileHeader}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={styles.menuBtn}
          >
            <Menu size={22} />
          </button>
          <span className={styles.headerTitle}>Empire of Forex</span>
        </header>

        {/* Page Content */}
        <main className={styles.pageContent}>
          {children}
        </main>
      </div>
    </div>
  );
}
