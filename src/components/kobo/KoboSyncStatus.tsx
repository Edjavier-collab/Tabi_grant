"use client";

import { useKoboSync } from "@/hooks/useKobo";
import { RefreshCcw, CheckCircle } from "lucide-react";

export function KoboSyncStatus({ lastSync }: { lastSync: string }) {
    const { sync, syncing } = useKoboSync();

    return (
        <div className="flex flex-col md:flex-row items-center justify-between border-4 border-black bg-[#E2DFD8] p-6 shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] relative overflow-hidden">
            <div className="absolute top-0 right-1/4 w-64 h-64 bg-white/20 rounded-full blur-3xl -z-10 pointer-events-none"></div>

            <div className="flex items-center gap-6 mb-6 md:mb-0">
                <div className="h-16 w-16 bg-black flex items-center justify-center border-4 border-[#E2DFD8] shadow-[0_0_0_4px_black]">
                    <CheckCircle className="text-[#32CD32] w-8 h-8" />
                </div>
                <div>
                    <h3 className="font-heading text-2xl font-black uppercase tracking-widest">API Status: Connected</h3>
                    <p className="font-mono text-sm font-bold text-black/70 mt-1 uppercase tracking-wider">Last Sync: {lastSync}</p>
                </div>
            </div>

            <button
                onClick={sync}
                disabled={syncing}
                className={`flex items-center gap-3 px-8 py-4 border-4 border-black font-heading font-black text-lg uppercase tracking-widest transition-all ${syncing
                        ? "bg-gray-400 text-gray-700 cursor-not-allowed translate-x-[6px] translate-y-[6px] shadow-none"
                        : "bg-[#FF3500] text-black shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] hover:bg-black hover:text-white hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(17,17,17,1)]"
                    }`}
            >
                <RefreshCcw className={`w-6 h-6 stroke-[3] ${syncing ? 'animate-spin' : ''}`} />
                {syncing ? "SYNCING..." : "SYNC NOW"}
            </button>
        </div>
    );
}
