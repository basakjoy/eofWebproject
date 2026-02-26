'use client';
import { useState } from "react";
import { ChevronLeft, ChevronRight, TrendingUp } from "lucide-react";

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export function CalendarWidget() {
  const [currentDate] = useState(new Date(2026, 0, 22)); // January 22, 2026
  const today = 22;

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return day === 0 ? 6 : day - 1; // Convert to Monday = 0
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  return (
    <div className="glass-card rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">
          {MONTHS[currentDate.getMonth()]}, {currentDate.getFullYear()}
        </h3>
        <div className="flex gap-1">
          <button className="p-1 hover:bg-secondary rounded">
            <ChevronLeft className="w-4 h-4 text-muted-foreground" />
          </button>
          <button className="p-1 hover:bg-secondary rounded">
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {DAYS.map((day, i) => (
          <div key={i} className="text-xs text-muted-foreground py-1">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {days.map((day, i) => (
          <div
            key={i}
            className={`
              py-1.5 text-sm rounded-lg cursor-pointer transition-colors
              ${!day ? "invisible" : ""}
              ${day === today ? "bg-primary text-primary-foreground font-medium" : "hover:bg-secondary text-foreground"}
            `}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-success" />
          </div>
          <div>
            <p className="text-xl font-bold font-display text-foreground">$1,434</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="text-success">+12.4%</span> Today's profit
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
