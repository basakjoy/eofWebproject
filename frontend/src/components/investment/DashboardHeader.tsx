"use client";
import { useEffect, useState } from "react";
import { Bell, Settings, User, TrendingUp } from "lucide-react";
import  {Button } from "@/components/dashboard/ui/button";

export function DashboardHeader() {
    return (
        <header className="flex items-center justify-between py-6 px-8 border-b" style={{ borderColor: "#e2e8f0", backgroundColor: "#ffffff" }}>
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center" style={{ boxShadow: "0 0 30px rgba(13, 115, 237, 0.1)" }}>
                   <TrendingUp className="w-5 h-5" style={{ color: "#0D73ED" }}/>
                </div>
            <div>
                <a href="/home">
                    <h1 className="font-display text-xl font-semibold" style={{ color: "#1e293b" }}>Empire of <span style={{ background: "linear-gradient(135deg, #0D73ED 0%, #0A5CB8 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Forex</span>
                </h1>
                </a>
                <p className="text-xs" style={{ color: "#64748b" }}>Investment Dashboard</p>
            </div>
            </div>

            <div className="flex items-center gap-4">
                 {/* Notification */}
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="w-5 h-5" style={{ color: "#64748b" }} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full" />
                </Button>

                {/* Settings */}
                <Button variant="ghost" size="icon">
                    <Settings className="w-5 h-5" style={{ color: "#64748b" }} />
                </Button>

                {/* Profile */}
                <div className="flex items-center gap-3 ml-2 pl-4 border-l" style={{ borderColor: "#e2e8f0" }}>
                    <div className="text-right">
                        <p className="text-sm font-medium" style={{ color: "#1e293b" }}>
                            Trader Joy
                        </p>

                        <p className="text-xs" style={{ color: "#64748b" }}>Premium Account</p>
                    </div>

                    <div className="w-10 h-10 rounded-full p-2 flex items-center justify-center" style={{ background: "linear-gradient(to bottom right, rgba(13, 115, 237, 0.8), #0D73ED)" }}>
                        <User className="w-5 h-5 text-white" />
                    </div>
                </div>

               
            </div>
        </header>
    )
}