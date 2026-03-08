"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { KoboSyncStatus } from "@/components/kobo/KoboSyncStatus";
import { KoboFormCard } from "@/components/kobo/KoboFormCard";
import { KoboDataTable } from "@/components/kobo/KoboDataTable";
import { FolderGit2 } from "lucide-react";

export default function FieldDataPage() {
    const [selectedForm, setSelectedForm] = useState<string | null>(null);

    return (
        <div className="flex flex-col h-screen bg-[#FDFCF8] font-mono">
            <DashboardHeader title="Field Data" />

            <main className="flex-1 overflow-auto p-8 relative">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF3500]/5 rounded-full blur-3xl -z-10 pointer-events-none translate-x-1/2 -translate-y-1/2"></div>

                <div className="max-w-6xl mx-auto space-y-12">
                    <KoboSyncStatus lastSync="2 hours ago" />

                    <div>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="bg-black text-white p-2 border-2 border-black">
                                <FolderGit2 className="w-8 h-8" />
                            </div>
                            <h2 className="font-heading font-black text-3xl uppercase tracking-widest text-black">Form Connections</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div onClick={() => setSelectedForm('Tree Planting Log')} className="h-full">
                                <KoboFormCard name="Tree Planting Log" submissions={23} newSinceSync={3} lastEntry="Mar 5, 2026" />
                            </div>
                            <div onClick={() => setSelectedForm('Aluyan River Watershed Monitoring')} className="h-full">
                                <KoboFormCard name="Aluyan River Watershed Monitoring" submissions={12} newSinceSync={1} lastEntry="Mar 3, 2026" />
                            </div>
                            <div onClick={() => setSelectedForm('Bantay Bukid Patrol Report')} className="h-full">
                                <KoboFormCard name="Bantay Bukid Patrol Report" submissions={47} newSinceSync={5} lastEntry="Mar 6, 2026" />
                            </div>
                            <div onClick={() => setSelectedForm('Roots and Rivers: Photo Story')} className="h-full">
                                <KoboFormCard name="Roots and Rivers: Photo Story" submissions={8} newSinceSync={0} lastEntry="Feb 28, 2026" />
                            </div>
                        </div>
                    </div>

                    {selectedForm && (
                        <div className="mt-12 animate-in fade-in slide-in-from-bottom sm:slide-in-from-right-8 duration-500 ease-out">
                            <KoboDataTable formName={selectedForm} data={[]} />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
