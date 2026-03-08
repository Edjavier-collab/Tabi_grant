"use client";

import { FileSpreadsheet, ArrowRight } from "lucide-react";

export function KoboFormCard({
    name,
    submissions,
    newSinceSync,
    lastEntry
}: {
    name: string;
    submissions: number;
    newSinceSync: number;
    lastEntry: string;
}) {
    return (
        <div className="group border-4 border-black bg-white transition-all hover:bg-black hover:text-white cursor-pointer relative overflow-hidden flex flex-col h-full shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF3500] rounded-bl-full z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none translate-x-10 -translate-y-10"></div>

            <div className="p-6 border-b-4 border-black group-hover:border-white/20 transition-colors z-10 flex-grow">
                <div className="flex items-start justify-between">
                    <div className="bg-black text-white group-hover:bg-white group-hover:text-black p-3 mb-4 transition-colors">
                        <FileSpreadsheet className="w-6 h-6" />
                    </div>
                    {newSinceSync > 0 && (
                        <span className="bg-[#32CD32] border-2 border-black px-3 py-1 font-mono text-xs font-black text-black uppercase shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]">
                            +{newSinceSync} New
                        </span>
                    )}
                </div>
                <h3 className="font-heading text-xl font-black uppercase tracking-wider mb-2 pr-4">{name}</h3>
            </div>

            <div className="p-6 bg-[#F8F8F8] group-hover:bg-transparent transition-colors z-10 mt-auto border-t-4 border-black group-hover:border-white/20">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="font-mono text-xs uppercase tracking-widest text-[#FF3500] font-black mb-1">Submissions</p>
                        <p className="font-mono text-3xl font-black">{submissions}</p>
                    </div>
                    <div>
                        <p className="font-mono text-xs uppercase tracking-widest text-black/50 group-hover:text-white/50 font-black mb-1">Last Entry</p>
                        <p className="font-mono text-sm font-bold uppercase">{lastEntry}</p>
                    </div>
                </div>

                <div className="mt-6 flex items-center gap-2 font-mono text-sm font-black uppercase tracking-widest text-black group-hover:text-[#FF3500]">
                    <span>View Data</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </div>
            </div>
        </div>
    );
}
