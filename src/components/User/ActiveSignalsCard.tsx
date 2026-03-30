" use client"
import { TrendingUp } from "lucide-react";

export default function ActiveSignalCard() {
    return (
        <div className="rounded-2xl overflow-hidden relative min-h-[220px] flex flex-col justify-end">
            <img src="" alt="trading signals"  className="absolute inset-0 w-full h-full object-cover"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent "/>
            <div className="relative z-10 p-5">
                <div className="flex items-center justify-between">
                    <div>
                        <div className=" flex items-center gap-2 mb-1">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pluse"/>
                            <span className="text-green-400 text-xs font-semibold uppercase tracking-wide">5 Active</span>
                        </div>
                        <p className="text-white font-bold text-sm">Signals with Ai</p>
                    </div>
                    <div className="bg-yellow-400 text-black text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                        <TrendingUp size={13} />
                        <span>+2%</span>
                    </div>
                </div>
            </div>
        </div>
    );
}