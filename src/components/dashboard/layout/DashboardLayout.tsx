"use client";

import { useState } from "react";
import { Sidebar } from "@/components/common/Sidebar";
import { Header } from "./Header";
import { Menu } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-mesh flex relative">
      {/* Desktop Sidebar */}
      <div className="hidden md:block md:flex-shrink-0">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Mobile Sidebar Overlay - Fixed Position */}
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

      {/* Main Content - No margins on mobile */}
      <div
        className={`flex-1 flex flex-col w-full transition-all duration-300 ${
          sidebarCollapsed ? "md:ml-20" : "md:ml-64"
        }`}
      >
        {/* Mobile Header */}
        <div className="md:hidden flex items-center gap-4 h-16 px-4 border-b border-gray-700 bg-gray-900 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Toggle Sidebar"
          >
            <Menu className="w-6 h-6 text-gray-300" />
          </button>
          <span className="text-sm font-semibold text-gray-100">Empire Of Forex</span>
        </div>

        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
