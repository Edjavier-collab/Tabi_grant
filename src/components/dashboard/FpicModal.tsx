"use client";

import React, { useState } from "react";
import { updateGrantStage } from "@/lib/firebase/db";
import { Grant, Stage } from "@/types/grant";
import { ShieldAlert, X } from "lucide-react";

interface Props {
    grant: Grant | null;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (grantId: string, fpicDate: string, fpicUrl: string) => void;
}

export const FpicModal = ({ grant, isOpen, onClose, onSuccess }: Props) => {
    const [loading, setLoading] = useState(false);
    const [fpicDate, setFpicDate] = useState("");
    const [fpicUrl, setFpicUrl] = useState("");

    if (!isOpen || !grant) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!fpicDate || !fpicUrl) return;

        setLoading(true);
        try {
            // First, update the grant with the FPIC data and move it to Active
            await updateGrantStage(grant.id, "Active Grant" as Stage, {
                fpicConsentDate: new Date(fpicDate).toISOString(),
                fpicDocumentUrl: fpicUrl
            });

            // Notify parent to update local state visually
            onSuccess(grant.id, new Date(fpicDate).toISOString(), fpicUrl);
            onClose();
            setFpicDate("");
            setFpicUrl("");
        } catch (error) {
            console.error("Error saving FPIC data:", error);
            alert("Failed to save compliance data.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-all text-black">
            <div className="w-full max-w-lg bg-white border-4 border-black shadow-[16px_16px_0px_0px_rgba(230,59,46,1)] overflow-hidden animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b-4 border-black bg-signal text-white">
                    <h2 className="font-heading text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
                        <ShieldAlert className="h-7 w-7" />
                        FPIC Compliance Required
                    </h2>
                    <button
                        onClick={onClose}
                        className="flex h-10 w-10 items-center justify-center border-2 border-black bg-white text-black transition-all hover:bg-black hover:text-white shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
                    >
                        <X className="w-5 h-5 stroke-[3]" />
                    </button>
                </div>

                <div className="p-8 space-y-6 relative bg-offwhite">
                    <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>

                    <div className="relative z-10 space-y-4">
                        <p className="font-mono text-sm leading-relaxed border-l-4 border-signal pl-4 font-bold text-black/80">
                            You cannot move <span className="text-black bg-signal/20 px-1">{grant.funderName}</span> to Active status without logging Free, Prior and Informed Consent (FPIC) from the local community.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                            <div className="space-y-2">
                                <label className="font-mono text-xs uppercase tracking-[0.1em] font-black">Consent Resolution Date *</label>
                                <input
                                    required
                                    type="date"
                                    value={fpicDate}
                                    onChange={(e) => setFpicDate(e.target.value)}
                                    className="w-full px-4 py-3 bg-white border-2 border-black font-mono text-base font-bold focus:outline-none focus:ring-0 focus:shadow-[4px_4px_0px_0px_rgba(230,59,46,1)] transition-all uppercase"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="font-mono text-xs uppercase tracking-[0.1em] font-black">Documentation Link (Drive URL) *</label>
                                <input
                                    required
                                    type="url"
                                    value={fpicUrl}
                                    onChange={(e) => setFpicUrl(e.target.value)}
                                    placeholder="https://drive.google.com/..."
                                    className="w-full px-4 py-3 bg-white border-2 border-black font-mono text-sm focus:outline-none focus:ring-0 focus:shadow-[4px_4px_0px_0px_rgba(230,59,46,1)] transition-all"
                                />
                            </div>

                            <div className="pt-4 flex gap-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-6 py-4 bg-white text-black border-2 border-black font-heading text-base font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]"
                                >
                                    CANCEL
                                </button>
                                <button
                                    disabled={loading}
                                    type="submit"
                                    className="flex-1 py-4 bg-signal text-white border-2 border-black font-heading text-base font-black uppercase tracking-widest hover:bg-black transition-all disabled:opacity-50 shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]"
                                >
                                    {loading ? "VERIFYING..." : "CONFIRM COMPLIANCE"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
