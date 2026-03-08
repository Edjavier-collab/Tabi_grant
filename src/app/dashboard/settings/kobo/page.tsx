"use client";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { KoboConfigForm } from "@/components/kobo/KoboConfigForm";

export default function KoboSettingsPage() {
    return (
        <div className="flex flex-col h-screen bg-[#FDFCF8] font-mono">
            <DashboardHeader title="KoBo Settings" />

            <main className="flex-1 overflow-auto p-8 relative">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF3500]/5 rounded-full blur-3xl -z-10 pointer-events-none translate-x-1/2 -translate-y-1/2"></div>

                <div className="max-w-3xl mx-auto">
                    <KoboConfigForm />
                </div>
            </main>
        </div>
    );
}
