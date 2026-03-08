"use client";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ReportGenerator } from "@/components/reports/ReportGenerator";
import { ReportDataSources } from "@/components/reports/ReportDataSources";
import { MonitoringReminders } from "@/components/reports/MonitoringReminders";

export default function ReportsPage() {
    return (
        <div className="flex flex-col h-screen bg-[#FDFCF8] font-mono">
            <DashboardHeader title="Monitoring & Impact Reports" />

            <main className="flex-1 overflow-auto p-8 relative">
                {/* Visual accent */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFD700]/10 rounded-full blur-3xl -z-10 pointer-events-none translate-x-1/2 cursor-none"></div>

                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <h2 className="font-heading font-black text-4xl uppercase tracking-widest mb-4">Report Builder</h2>
                            <p className="font-mono text-sm text-black/60 font-bold uppercase max-w-2xl leading-relaxed">
                                Automate grantee and donor reporting by synthesizing field data (KoBoToolbox) and realtime impact metrics into formatted DOCX drafts and cover emails using Gemini.
                            </p>
                        </div>
                        <ReportGenerator />
                    </div>

                    <div className="space-y-8 pt-8 lg:pt-0">
                        <MonitoringReminders />
                        <ReportDataSources />
                    </div>
                </div>
            </main>
        </div>
    );
}
