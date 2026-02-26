'use client';
import { Plus, Send, FileText, Users, Settings, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const actions = [
  { icon: TrendingUp, label: "New Signal", color: "bg-primary/20 text-primary", href: "/signals" },
  { icon: FileText, label: "Write Article", color: "bg-accent/20 text-accent", href: "/articles" },
  { icon: Send, label: "Send Alert", color: "bg-warning/20 text-warning", href: "/notifications" },
  { icon: Users, label: "Add User", color: "bg-chart-4/20 text-chart-4", href: "/users" },
];

export function QuickActions() {
  return (
    <div className="glass-card rounded-xl p-5">
      <h3 className="section-title">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <button
            key={action.label}
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors group"
          >
            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", action.color)}>
              <action.icon className="w-5 h-5" />
            </div>
            <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
