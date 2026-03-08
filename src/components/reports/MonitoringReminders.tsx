"use client";

import { Clock, AlertTriangle } from "lucide-react";

export function MonitoringReminders() {
    return (
        <div className="border-4 border-black bg-[#FF3500] text-black shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-black rounded-bl-full z-0 opacity-10 pointer-events-none translate-x-10 -translate-y-10"></div>

            <div className="px-6 py-4 border-b-4 border-black bg-black text-white flex items-center gap-3 z-10 relative">
                <AlertTriangle className="w-5 h-5 text-[#FF3500]" />
                <h2 className="font-heading font-black text-base uppercase tracking-widest">Upcoming Deadlines</h2>
            </div>

            <div className="p-0 z-10 relative bg-white">
                <div className="p-4 border-b-4 border-black flex items-center gap-4 hover:bg-[#F8F8F8] cursor-pointer transition-colors">
                    <div className="bg-[#FF3500] text-black font-mono font-black border-2 border-black px-2 py-1 text-center min-w-[60px] shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]">
                        <span className="block text-xl">7</span>
                        <span className="block text-[10px] uppercase">Days</span>
                    </div>
                    <div>
                        <p className="font-heading font-black uppercase text-lg leading-tight">Q1 Progress Report</p>
                        <p className="font-mono text-xs font-bold text-black/60 uppercase mt-1">Moore Foundation</p>
                    </div>
                </div>

                <div className="p-4 flex items-center gap-4 hover:bg-[#F8F8F8] cursor-pointer transition-colors opacity-70">
                    <div className="bg-[#E2DFD8] text-black font-mono font-black border-2 border-black px-2 py-1 text-center min-w-[60px] shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]">
                        <span className="block text-xl">42</span>
                        <span className="block text-[10px] uppercase">Days</span>
                    </div>
                    <div>
                        <p className="font-heading font-black uppercase text-lg leading-tight">Annual Narrative</p>
                        <p className="font-mono text-xs font-bold text-black/60 uppercase mt-1">UNDP SGP</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
