"use client";

import { useState } from "react";
import { Save, Key, AppWindow } from "lucide-react";

export function KoboConfigForm() {
    const [apiKey, setApiKey] = useState("••••••••••••••••••••••••••••");

    return (
        <div className="space-y-8">
            <section className="border-4 border-black bg-white shadow-[6px_6px_0px_0px_rgba(17,17,17,1)]">
                <div className="px-6 py-4 border-b-4 border-black bg-black text-white flex items-center gap-3">
                    <Key className="w-5 h-5" />
                    <h2 className="font-heading font-black text-base uppercase tracking-widest">KoBo API Configuration</h2>
                </div>
                <div className="p-6 space-y-6">
                    <div className="space-y-2">
                        <label className="font-mono text-xs font-black text-[#FF3500] uppercase tracking-widest">KOBO_API_KEY (from .env)</label>
                        <input
                            disabled
                            value={apiKey}
                            className="w-full px-4 py-3 bg-black text-white border-2 border-black font-mono text-sm font-bold opacity-70"
                        />
                        <p className="font-mono text-xs font-bold text-black/50 mt-1 uppercase">Stored securely in environment variables.</p>
                    </div>
                </div>
            </section>

            <section className="border-4 border-black bg-white shadow-[6px_6px_0px_0px_rgba(17,17,17,1)]">
                <div className="px-6 py-4 border-b-4 border-black bg-black text-white flex items-center gap-3">
                    <AppWindow className="w-5 h-5" />
                    <h2 className="font-heading font-black text-base uppercase tracking-widest">Connected Forms</h2>
                </div>
                <div className="p-0">
                    {/* Mock connected forms list mimicking brutalist settings */}
                    {[
                        { name: "Tree Planting Log", uid: "abc12345", status: "Active" },
                        { name: "Aluyan River Watershed Monitoring", uid: "def67890", status: "Active" },
                        { name: "Bantay Bukid Patrol Report", uid: "ghi11223", status: "Active" },
                        { name: "Roots and Rivers: Photo Story", uid: "jkl44556", status: "Active" }
                    ].map((form, i) => (
                        <div key={i} className={`p-4 font-mono border-b-4 border-black last:border-b-0 flex items-center justify-between ${i % 2 === 0 ? 'bg-white' : 'bg-[#E2DFD8]'}`}>
                            <div>
                                <p className="font-bold uppercase mb-1">{form.name}</p>
                                <p className="text-xs text-black/60 uppercase tracking-widest">UID: {form.uid}</p>
                            </div>
                            <span className="px-3 py-1 bg-black text-white text-xs font-bold shadow-[2px_2px_0px_0px_rgba(255,53,0,1)] uppercase tracking-wider">
                                {form.status}
                            </span>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
