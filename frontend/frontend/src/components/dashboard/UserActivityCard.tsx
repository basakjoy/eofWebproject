"use client";
import { Users, UserPlus, UserCheck, Activity } from "lucide-react";

const stats = [
  { label: "Total Users", value: "12,847", icon: Users, change: "+142" },
  { label: "New This Month", value: "486", icon: UserPlus, change: "+23%" },
  { label: "Active Today", value: "2,341", icon: UserCheck, change: "+8%" },
  { label: "Sessions", value: "8.2K", icon: Activity, change: "+12%" },
];

export function UserActivityCard() {
  return (
    <div className="glass-card rounded-xl p-5">
      <h3 className="section-title">User Activity</h3>
      <div className="space-y-4">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                <stat.icon className="w-4 h-4 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">{stat.label}</span>
            </div>
            <div className="text-right">
              <span className="font-semibold text-foreground">{stat.value}</span>
              <span className="text-xs text-success ml-2">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
