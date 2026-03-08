"use client";

import { Database, CheckCircle2 } from "lucide-react";

export function ReportDataSources() {
    return (
        <div className="border-4 border-black bg-white shadow-[6px_6px_0px_0px_rgba(17,17,17,1)]">
            <div className="px-6 py-4 border-b-4 border-black bg-black text-white flex items-center gap-3">
                <Database className="w-5 h-5" />
                <h2 className="font-heading font-black text-base uppercase tracking-widest">Connected Sources</h2>
            </div>

            <div className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#32CD32] shrink-0" />
                    <span className="font-mono text-sm font-bold uppercase truncate">KoBo: Tree Planting Log</span>
                </div>
                <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#32CD32] shrink-0" />
                    <span className="font-mono text-sm font-bold uppercase truncate">KoBo: Bantay Bukid Patrols</span>
                </div>
                <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#32CD32] shrink-0" />
                    <span className="font-mono text-sm font-bold uppercase truncate">KoBo: Watershed Data</span>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t-2 border-dashed border-black/20">
                    <CheckCircle2 className="w-5 h-5 text-[#00FFFF] shrink-0" />
                    <span className="font-mono text-sm font-black uppercase truncate">Impact Dashboard API</span>
                </div>
            </div>
        </div>
    );
}
