"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { KoboSyncStatus } from "@/components/kobo/KoboSyncStatus";
import { KoboFormCard } from "@/components/kobo/KoboFormCard";
import { KoboDataTable } from "@/components/kobo/KoboDataTable";
import { useKoboData, useKoboForms } from "@/hooks/useKobo";
import { KOBO_FORM_MAPPING } from "@/lib/kobo-mapping";
import { FolderGit2 } from "lucide-react";
import { format } from "date-fns";

export default function FieldDataPage() {
    const [selectedFormKey, setSelectedFormKey] = useState<string | null>(null);
    
    // Fetch all forms metadata (to get submission counts)
    const { forms } = useKoboForms();

    // Fetch data for the selected form key (e.g. 'tree_planting_log')
    const { data, loading } = useKoboData(selectedFormKey || "");

    const handleFormSelect = (key: string) => {
        if (selectedFormKey === key) {
            setSelectedFormKey(null);
        } else {
            setSelectedFormKey(key);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-[#FDFCF8] font-mono">
            <DashboardHeader title="Field Data" />

            <main className="flex-1 overflow-auto p-8 relative">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF3500]/5 rounded-full blur-3xl -z-10 pointer-events-none translate-x-1/2 -translate-y-1/2"></div>

                <div className="max-w-6xl mx-auto space-y-12">
                    <KoboSyncStatus lastSync="Real-time" />

                    <div>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="bg-black text-white p-2 border-2 border-black">
                                <FolderGit2 className="w-8 h-8" />
                            </div>
                            <h2 className="font-heading font-black text-3xl uppercase tracking-widest text-black">Form Connections</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {Object.entries(KOBO_FORM_MAPPING).map(([key, config]) => {
                                // Match by name instead of UID since UIDs aren't public on client
                                const apiForm = forms.find(f => f.name === config.displayName);
                                const submissionCount = apiForm?.deployment__submission_count || 0;
                                
                                let lastEntryLabel = "No Entries";
                                if (apiForm?.deployment__last_submission_time) {
                                    lastEntryLabel = format(new Date(apiForm.deployment__last_submission_time), "MMM d, yyyy");
                                }

                                return (
                                    <div 
                                        key={key} 
                                        onClick={() => handleFormSelect(key)} 
                                        className={`h-full cursor-pointer transition-transform hover:-translate-y-1 ${selectedFormKey === key ? 'ring-4 ring-signal ring-offset-4 ring-offset-[#FDFCF8]' : ''}`}
                                    >
                                        <KoboFormCard 
                                            name={config.displayName} 
                                            submissions={submissionCount} 
                                            newSinceSync={0} 
                                            lastEntry={lastEntryLabel} 
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {selectedFormKey && (
                        <div className="mt-12 animate-in fade-in slide-in-from-bottom sm:slide-in-from-right-8 duration-500 ease-out">
                            <KoboDataTable 
                                formName={KOBO_FORM_MAPPING[selectedFormKey]?.displayName || "Selected Form"} 
                                data={data} 
                                loading={loading}
                            />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
