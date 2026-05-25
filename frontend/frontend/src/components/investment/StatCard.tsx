"use client";

import {LucideIcon, TrendingUp,TrendingDown }  from "lucide-react";


interface StatCardProps {
    title: string;
    value: string;
    change: string;
    isPositive: boolean;
    icon: LucideIcon;
}

export default function StatCard ({
    title,
    value,
    change,
    isPositive,
    icon: Icon,
}: StatCardProps) {
    return (
        <div className="stat-card">
            <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: "rgba(13, 115, 237, 0.1)" }}>
                    <Icon className="w-6 h-6" style={{ color: "#0D73ED" }} />
                </div>
                <div className="flex items-center gap-1 text-sm font-medium" style={{ color: isPositive ? "#10b981" : "#ef4444" }}>
                    {isPositive ? (
                        <TrendingUp className="w-4 h-4" />

                    ) : (
                        <TrendingDown className="w-4 h-4" />
                    )}
                    {change}    
            
                </div>
            
            </div>
        <p className="text-sm mb-1" style={{ color: "#64748b" }}> {title} </p>

        <p className="text-2xl font-display font-bold" style={{ color: "#1e293b" }}> {value} </p>
        </div>
    );
}