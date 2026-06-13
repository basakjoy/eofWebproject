"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Bell, User as UserIcon, Menu, Home, ChevronDown, Check, LogOut, Settings, Shield } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";


interface AdminHeaderProps {
  onMenuClick?: () => void;
}

const currencies = [
  { code: "BDT", name: "Bangladeshi Take (BDT)", flag: "🇧🇩" },
  { code: "USD", name: "US Dollar ($)", flag: "🇺🇸" },
  { code: "EUR", name: "Euro (€)", flag: "🇪🇺" },
  
];

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuthStore();
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <header className="h-20 border-b border-white/5 bg-background/80 backdrop-blur-xl sticky top-0 z-30 flex items-center justify-between px-6 sm:px-8">
      {/* Left Section: Mobile Menu Trigger & Breadcrumbs */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 border border-white/5 transition-all"
        >
          <Menu size={20} />
        </button>

        {/* Breadcrumb Navigation */}
        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-400">
          <Link href="/admin?tab=overview" className="flex items-center gap-1 hover:text-white transition-colors">
            <Home size={14} className="text-primary" />
            <span>Home</span>
          </Link>
          <span className="text-slate-600">/</span>
          <span className="text-slate-200">Dashboard</span>
        </div>
      </div>

      {/* Right Section: Currency Selector, Notifications, User Profile */}
      <div className="flex items-center gap-4 sm:gap-6">
        
        {/* Currency Type Selector */}
        <div className="relative">
          <div className="flex items-center gap-2">
            <span className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider hidden md:inline">
              Currency Type
            </span>
            <button
              onClick={() => {
                setCurrencyOpen(!currencyOpen);
                setProfileOpen(false);
                setNotificationsOpen(false);
              }}
              className="flex items-center gap-2 bg-background border border-white/5 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-white/5 transition-all shadow-inner"
            >
              <span>{selectedCurrency.flag}</span>
              <span className="font-display">{selectedCurrency.code}</span>
              <ChevronDown size={14} className={cn("text-slate-400 transition-transform duration-200", currencyOpen && "transform rotate-180")} />
            </button>
          </div>

          <AnimatePresence>
            {currencyOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-2 w-48 bg-background border border-white/5 rounded-2xl p-1.5 shadow-2xl z-50 overflow-hidden"
              >
                {currencies.map((currency) => (
                  <button
                    key={currency.code}
                    onClick={() => {
                      setSelectedCurrency(currency);
                      setCurrencyOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 text-xs sm:text-sm rounded-xl transition-all text-slate-300 hover:text-white hover:bg-white/5",
                      selectedCurrency.code === currency.code && "bg-primary/10 text-primary font-semibold"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span>{currency.flag}</span>
                      <span>{currency.code}</span>
                    </div>
                    {selectedCurrency.code === currency.code && <Check size={14} className="text-primary" />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Separator */}
        <div className="w-[1px] h-6 bg-white/5 hidden sm:block" />

        {/* Notifications Icon Button */}
        <div className="relative">
          <button
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setProfileOpen(false);
              setCurrencyOpen(false);
            }}
            className="p-2.5 rounded-xl bg-background border border-white/5 text-slate-400 hover:text-white hover:bg-white/5 transition-all relative group"
          >
            <Bell size={18} className="group-hover:scale-115 transition-transform" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full border border-background animate-pulse" />
          </button>

          <AnimatePresence>
            {notificationsOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-2 w-80 bg-background border border-white/5 rounded-2xl p-4 shadow-2xl z-50 space-y-3"
              >
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="font-display font-bold text-xs sm:text-sm text-white">Notifications</span>
                  <span className="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full font-bold">1 New</span>
                </div>
                <div className="space-y-2">
                  <div className="p-2.5 bg-black border border-white/5 rounded-xl text-left">
                    <p className="text-xs font-bold text-white leading-snug">New Deposit Request Approved</p>
                    <p className="text-[10px] text-slate-400 mt-1 leading-normal">Myanmar Kyats (K50,000) was approved for member parvejm.</p>
                    <span className="text-[8px] text-slate-500 block mt-2 font-semibold uppercase">2 mins ago</span>
                  </div>
                </div>
                 <div className="space-y-2">
                  <div className="p-2.5 bg-black border border-white/5 rounded-xl text-left">
                    <p className="text-xs font-bold text-white leading-snug">New Withdrawal Request Rejected</p>
                    <p className="text-[10px] text-slate-400 mt-1 leading-normal">Your withdrawal request for USD 100.00 has been rejected.</p>
                    <span className="text-[8px] text-slate-500 block mt-2 font-semibold uppercase">5 mins ago</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile Section */}
        <div className="relative">
          <button
            onClick={() => {
              setProfileOpen(!profileOpen);
              setCurrencyOpen(false);
              setNotificationsOpen(false);
            }}
            className="bg-background border border-white/5 hover:border-primary/30 p-1 pr-3 sm:pr-4 rounded-2xl flex items-center gap-3 transition-all cursor-pointer shadow-md group"
          >
            {/* Avatar */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/10 font-bold text-white text-xs sm:text-sm group-hover:scale-105 transition-transform">
              {user?.name ? user.name[0].toUpperCase() : "P"}
            </div>

            {/* Profile Info */}
            <div className="hidden md:flex flex-col items-start text-left">
              <span className="text-xs font-bold text-slate-200 leading-none group-hover:text-white transition-colors">
                {user?.name || "parvejm"}
              </span>
              <span className="text-[9px] font-bold text-primary uppercase tracking-wider mt-0.5">
                {user?.role || "Administrator"}
              </span>
            </div>
            
            <ChevronDown size={14} className={cn("text-slate-500 transition-transform duration-200", profileOpen && "transform rotate-180")} />
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 3, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-2 w-56 bg-background border border-white/5 rounded-2xl p-1.5 shadow-2xl z-50 space-y-1 overflow-hidden"
              >
                <div className="px-3 py-2 border-b border-white/5 mb-1.5">
                  <p className="text-xs font-bold text-white">{user?.name || "parvejm"}</p>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">{user?.email || "admin@empireforex.com"}</p>
                </div>
                
                <Link
                  href="/admin?tab=settings"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs sm:text-sm rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-all"
                >
                  <Settings size={14} className="text-slate-400" />
                  <span>Account Settings</span>
                </Link>

                <Link
                  href="/admin?tab=overview"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs sm:text-sm rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-all"
                >
                  <Shield size={14} className="text-slate-400" />
                  <span>Security & Roles</span>
                </Link>

                <div className="h-[1px] bg-white/5 my-1" />

                <button
                  onClick={() => {
                    logout();
                    setProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs sm:text-sm rounded-xl text-red-400 hover:bg-red-500/10 transition-all text-left"
                >
                  <LogOut size={14} />
                  <span>Logout</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </header>
  );
};
