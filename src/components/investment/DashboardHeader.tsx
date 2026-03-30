"use client";
import { Bell, Settings, User, TrendingUp } from "lucide-react";
import { Button } from "@/components/dashboard/ui/button";
import { useThemeStore } from "@/store/themeStore";
import { useThemeColors } from "@/lib/themeColors";
import { LogoIcon } from "@/components/common/LogoIcon";

export function DashboardHeader() {
const theme = useThemeStore((state) => state.theme);
const colors = useThemeColors();



    return (
        <header className="flex items-center justify-between py-4 sm:py-6 px-4 sm:px-8 border-b sticky top-0 z-50 transition-colors duration-300" style={{ borderColor: colors.border, backgroundColor: colors.bg.primary }}>
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center flex-shrink-0">
                    <LogoIcon size={48} rounded />
                </div>
                <div>
                    <a href="/home">
                        <h1 className="font-display text-lg sm:text-xl font-semibold leading-tight transition-colors duration-300" style={{ color: colors.text.primary }}>Empire of <span style={{ background: "linear-gradient(135deg, #0D73ED 0%, #0A5CB8 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Forex</span>
                        </h1>
                    </a>
                    <p className="text-[10px] sm:text-xs transition-colors duration-300" style={{ color: colors.text.secondary }}>Investment Dashboard</p>
                </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
                {/* Notification */}
                <Button variant="ghost" size="icon" className="relative w-8 h-8 sm:w-10 sm:h-10 hover:opacity-80">
                    <Bell className="w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-300" style={{ color: colors.text.secondary }} />
                    <span className="absolute top-1 right-1 sm:top-2 sm:right-2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full" />
                </Button>

                {/* Settings */}
                <Button variant="ghost" size="icon" className="hidden xs:flex w-8 h-8 sm:w-10 sm:h-10 hover:opacity-80">
                    <Settings className="w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-300" style={{ color: colors.text.secondary }} />
                </Button>

                {/* Profile */}
                <div className="flex items-center gap-2 sm:gap-3 ml-1 sm:ml-2 pl-2 sm:pl-4 border-l transition-colors duration-300" style={{ borderColor: colors.border }}>
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium transition-colors duration-300" style={{ color: colors.text.primary }}>
                            Trader Joy
                        </p>

                        <p className="text-xs transition-colors duration-300" style={{ color: colors.text.secondary }}>Investor Account</p>
                    </div>

                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(to bottom right, rgba(13, 115, 237, 0.8), #0D73ED)" }}>
                        <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                </div>
            </div>
        </header>
    );
}
