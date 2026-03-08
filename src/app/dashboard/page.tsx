"use client";

import { useState } from "react";
import { KanbanBoard } from "@/components/dashboard/KanbanBoard";
import { NewGrantModal } from "@/components/dashboard/NewGrantModal";
import { PriorityAlertBanner } from "@/components/dashboard/PriorityAlertBanner";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Plus, RefreshCcw } from "lucide-react";

export default function DashboardPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);

    const handleSync = async () => {
        setIsSyncing(true);
        try {
            const res = await fetch("/api/gmail/sync", { method: "POST" });
            const data = await res.json();
            alert(data.message || data.error || "Sync completed.");
        } catch (error) {
            console.error("Sync error:", error);
            alert("Failed to sync emails.");
        } finally {
            setIsSyncing(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-paper font-mono">
            <DashboardHeader
                title="Pipeline Tracker"
                actionButton={
                    <div className="flex gap-4">
                        <button
                            onClick={handleSync}
                            disabled={isSyncing}
                            className={`flex items-center gap-2 border-2 border-black px-6 py-2.5 font-heading text-sm font-black uppercase tracking-wider transition-all shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] ${isSyncing
                                    ? "bg-gray-300 text-gray-600 cursor-not-allowed shadow-none translate-x-[2px] translate-y-[2px]"
                                    : "bg-white text-black hover:bg-gray-100 hover:shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] hover:translate-x-[2px] hover:translate-y-[2px]"
                                }`}
                        >
                            <RefreshCcw className={`h-4 w-4 stroke-[3] ${isSyncing ? "animate-spin" : ""}`} />
                            {isSyncing ? "Syncing..." : "Sync Emails"}
                        </button>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 border-2 border-black bg-signal px-6 py-2.5 font-heading text-sm font-black uppercase tracking-wider text-black transition-all hover:bg-black hover:text-white shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] hover:shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] hover:translate-x-[2px] hover:translate-y-[2px]"
                        >
                            <Plus className="h-5 w-5 stroke-[3]" />
                            Initialize Target
                        </button>
                    </div>
                }
            />
            {/* Main Board Area */}
            <main className="flex-1 overflow-auto relative p-8">
                {/* Background brutalist accents */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-signal/5 rounded-full blur-3xl -z-10 pointer-events-none translate-x-1/2 -translate-y-1/2"></div>

                <PriorityAlertBanner />
                <KanbanBoard />
            </main>

            <NewGrantModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => {
                    // Firebase listener handles the state sync, no manual needed
                }}
            />
        </div>
    );
}
