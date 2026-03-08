"use client";

import { useImpactMetrics } from "@/hooks/useImpactMetrics";
import { RefreshCcw, Activity } from "lucide-react";

export function ImpactSyncStatus({ projectId }: { projectId: string }) {
    const { metrics, sync, loading } = useImpactMetrics(projectId);

    const lastSync = metrics?.lastScrapedAt
        ? new Date(metrics.lastScrapedAt).toLocaleString()
        : "Never";

    return (
        <div className="flex flex-col md:flex-row items-center justify-between border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(255,53,0,1)] relative overflow-hidden">
            <div className="flex items-center gap-6 mb-6 md:mb-0 z-10">
                <div className="h-16 w-16 bg-[#FF3500] flex items-center justify-center border-4 border-black">
                    <Activity className="text-white w-8 h-8" />
                </div>
                <div>
                    <h3 className="font-heading text-xl font-black uppercase tracking-widest leading-none mb-2">Impact Dashboard Sync</h3>
                    <p className="font-mono text-xs font-bold text-black/60 uppercase tracking-widest break-all">Source: roots2river.vercel.app/impact</p>
                    <p className="font-mono text-sm font-black text-black mt-2 bg-[#E2DFD8] inline-block px-2 py-1 border-2 border-black">LAST SYNC: {lastSync}</p>
                </div>
            </div>

            <button
                onClick={sync}
                disabled={loading}
                className={`z-10 flex items-center gap-3 px-8 py-4 border-4 border-black font-heading font-black text-lg uppercase tracking-widest transition-all ${loading
                        ? "bg-gray-400 text-gray-700 cursor-not-allowed translate-x-[6px] translate-y-[6px] shadow-none"
                        : "bg-black text-white shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] hover:bg-[#FF3500] hover:text-black hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(17,17,17,1)]"
                    }`}
            >
                <RefreshCcw className={`w-6 h-6 stroke-[3] ${loading ? 'animate-spin' : ''}`} />
                {loading ? "SYNCING..." : "SYNC NOW"}
            </button>
        </div>
    );
}
