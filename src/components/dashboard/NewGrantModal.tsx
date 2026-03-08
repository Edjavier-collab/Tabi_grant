"use client";

import React, { useState } from "react";
import { Stage } from "@/types/grant";
import { Sparkles, X } from "lucide-react";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const NewGrantModal = ({ isOpen, onClose, onSuccess }: Props) => {
    const [loading, setLoading] = useState(false);
    const [extracting, setExtracting] = useState(false);
    const [mode, setMode] = useState<"manual" | "ai">("manual");

    // Form state
    const [funderName, setFunderName] = useState("");
    const [amount, setAmount] = useState("");
    const [projectLinked, setProjectLinked] = useState("");
    const [deadline, setDeadline] = useState("");

    // AI state
    const [aiInput, setAiInput] = useState("");

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!funderName || !amount || !projectLinked) return;

        setLoading(true);
        try {
            const grantData = {
                funderName,
                amountRequested: Number(amount),
                projectLinked,
                currentStage: "Prospect" as Stage,
                ...(deadline ? { loiDeadline: new Date(deadline).toISOString() } : {}),
            };

            const response = await fetch("/api/grants", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(grantData),
            });

            if (!response.ok) {
                throw new Error("Failed to add grant via API");
            }

            setLoading(false);
            onSuccess();
            onClose();
            // Reset
            setFunderName("");
            setAmount("");
            setProjectLinked("");
            setDeadline("");
        } catch (error) {
            console.error("Error adding grant:", error);
            alert("Failed to add grant");
            setLoading(false);
        }
    };

    const handleExtract = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!aiInput) return;

        setExtracting(true);
        try {
            const isUrl = aiInput.startsWith("http://") || aiInput.startsWith("https://");

            const reqBody = isUrl
                ? { url: aiInput }
                : { textContent: aiInput };

            const response = await fetch("/api/extract-funder", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(reqBody)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to extract");
            }

            const { data } = await response.json();

            if (data.funderName) setFunderName(data.funderName);
            if (data.amountRequested) setAmount(data.amountRequested.toString());
            if (data.loiDeadline) setDeadline(data.loiDeadline);

            setMode("manual");
        } catch (error) {
            console.error("Extraction error:", error);
            const message = error instanceof Error ? error.message : "Unknown error";
            alert(`Extraction failed: ${message}. Please try manual entry.`);
        } finally {
            setExtracting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-offwhite/80 backdrop-blur-sm transition-all text-black">
            <div className="w-full max-w-lg bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(17,17,17,1)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-6 border-b-4 border-black bg-signal text-white">
                    <h2 className="font-heading text-3xl font-black uppercase tracking-tighter flex items-center gap-3">
                        {mode === "ai" ? <Sparkles className="h-6 w-6" /> : null}
                        Initialize Target
                    </h2>
                    <button
                        onClick={onClose}
                        className="flex h-10 w-10 items-center justify-center border-2 border-black bg-white text-black transition-all hover:bg-black hover:text-white shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
                    >
                        <X className="w-5 h-5 stroke-[3]" />
                    </button>
                </div>

                <div className="flex border-b-4 border-black font-mono text-sm font-black tracking-widest uppercase">
                    <button
                        onClick={() => setMode("manual")}
                        className={`flex-1 py-3 border-r-4 border-black transition-colors ${mode === "manual" ? "bg-black text-white" : "bg-offwhite text-black/50 hover:bg-black/5"}`}
                    >
                        Manual Config
                    </button>
                    <button
                        onClick={() => setMode("ai")}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 transition-colors ${mode === "ai" ? "bg-signal text-white" : "bg-offwhite text-black/50 hover:bg-signal/10 hover:text-signal"}`}
                    >
                        <Sparkles className="w-4 h-4" /> AI Extract
                    </button>
                </div>

                {mode === "manual" ? (
                    <form onSubmit={handleSubmit} className="p-8 space-y-6 relative">
                        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '16px 16px' }}></div>
                        <div className="space-y-2 relative z-10">
                            <label className="font-mono text-sm uppercase tracking-[0.1em] font-black">Funder Name *</label>
                            <input
                                required
                                type="text"
                                value={funderName}
                                onChange={(e) => setFunderName(e.target.value)}
                                className="w-full px-4 py-4 bg-offwhite border-2 border-black font-mono text-base focus:outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(230,59,46,1)] transition-all"
                                placeholder="e.g. Gordon and Betty Moore Foundation"
                            />
                        </div>

                        <div className="space-y-2 relative z-10">
                            <label className="font-mono text-sm uppercase tracking-[0.1em] font-black">Target Amount (USD) *</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono font-black text-black/50">$</span>
                                <input
                                    required
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full pl-8 pr-4 py-4 bg-offwhite border-2 border-black font-mono text-base focus:outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(230,59,46,1)] transition-all"
                                    placeholder="50000"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 relative z-10">
                            <label className="font-mono text-sm uppercase tracking-[0.1em] font-black">Linked Project *</label>
                            <select
                                required
                                value={projectLinked}
                                onChange={(e) => setProjectLinked(e.target.value)}
                                className="w-full px-4 py-4 bg-offwhite border-2 border-black font-mono text-base font-bold focus:outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(230,59,46,1)] transition-all appearance-none rounded-none"
                            >
                                <option value="" disabled>SELECT INTERNAL PROJECT &darr;</option>
                                <option value="Roots & Rivers">Roots & Rivers</option>
                                <option value="Bantay Bukid Patrols">Bantay Bukid Patrols</option>
                                <option value="General Ops">General Operations</option>
                            </select>
                        </div>

                        <div className="space-y-2 relative z-10">
                            <label className="font-mono text-sm uppercase tracking-[0.1em] font-black">Expected LOI Deadline</label>
                            <input
                                type="date"
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                                className="w-full px-4 py-4 bg-offwhite border-2 border-black font-mono text-base font-bold focus:outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(230,59,46,1)] transition-all uppercase"
                            />
                        </div>

                        <div className="pt-6 relative z-10">
                            <button
                                disabled={loading}
                                type="submit"
                                className="w-full py-5 bg-black text-white border-2 border-black font-heading text-lg font-black uppercase tracking-widest hover:bg-signal hover:text-black transition-all disabled:opacity-50 shadow-[6px_6px_0px_0px_rgba(230,59,46,1)] hover:shadow-[2px_2px_0px_0px_rgba(230,59,46,1)] hover:translate-x-[4px] hover:translate-y-[4px]"
                            >
                                {loading ? "INITIALIZING..." : "COMPILE TARGET"}
                            </button>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleExtract} className="p-8 space-y-6 bg-offwhite">
                        <div className="space-y-3">
                            <label className="font-mono text-sm uppercase tracking-[0.1em] font-black text-signal">Paste Funder URL or RFP Text</label>
                            <p className="text-xs font-mono text-black/60 leading-relaxed mb-4">Gemini will scan the target and auto-fill manual config parameters.</p>
                            <textarea
                                required
                                value={aiInput}
                                onChange={(e) => setAiInput(e.target.value)}
                                className="w-full h-48 px-4 py-4 bg-white border-2 border-black font-mono text-sm focus:outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(230,59,46,1)] transition-all resize-none"
                                placeholder={"https://www.packard.org/guidelines...\n\n-- OR --\n\nPaste raw PDF text here..."}
                            />
                        </div>

                        <div className="pt-4">
                            <button
                                disabled={extracting || !aiInput}
                                type="submit"
                                className="w-full py-5 bg-signal text-white border-2 border-black font-heading text-lg font-black uppercase tracking-widest hover:bg-black transition-all disabled:opacity-50 shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px]"
                            >
                                {extracting ? "ANALYZING INTELLIGENCE..." : "EXTRACT TARGET DATA"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};
