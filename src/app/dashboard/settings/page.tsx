"use client";

import React, { useState } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Mail, FileText, Save, CheckCircle2 } from "lucide-react";

export default function SettingsPage() {
    const [saved, setSaved] = useState(false);

    // Letterhead settings
    const [orgName, setOrgName] = useState("Tabi Po Foundation");
    const [taxStatus, setTaxStatus] = useState("A 501(c)(3) Tax-Exempt Organization");
    const [email, setEmail] = useState("email@tabipofoundation.org");
    const [website, setWebsite] = useState("www.tabipofoundation.org");
    const [phone, setPhone] = useState("");
    const [ein, setEin] = useState("88-33456484");
    const [address, setAddress] = useState("P.O. Box 10163, Palm Desert, California, USA 92255");

    // Email settings
    const [senderName, setSenderName] = useState("");
    const [senderTitle, setSenderTitle] = useState("");
    const [customInstructions, setCustomInstructions] = useState(
        "Always mention our partnership with Aluyan Caduha-an Farmers Association. Emphasize community-led approach. Reference our track record in Northern Negros. Keep tone humble but confident."
    );

    const handleSave = () => {
        // In a real implementation, this would save to Firestore /settings/
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="flex flex-col h-screen bg-paper font-mono">
            <DashboardHeader title="Settings" />

            <main className="flex-1 overflow-auto p-8">
                <div className="max-w-3xl mx-auto space-y-8">

                    {/* Letterhead Configuration */}
                    <section className="border-4 border-black bg-white shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] overflow-hidden">
                        <div className="px-6 py-4 border-b-4 border-black bg-black text-white flex items-center gap-3">
                            <FileText className="w-5 h-5" />
                            <h2 className="font-heading font-black text-base uppercase tracking-widest">Letterhead</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="font-mono text-xs font-black uppercase tracking-widest text-black/50">Organization Name</label>
                                    <input value={orgName} onChange={(e) => setOrgName(e.target.value)} className="w-full px-4 py-3 bg-offwhite border-2 border-black font-mono text-sm font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(230,59,46,1)] transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="font-mono text-xs font-black uppercase tracking-widest text-black/50">Tax Status</label>
                                    <input value={taxStatus} onChange={(e) => setTaxStatus(e.target.value)} className="w-full px-4 py-3 bg-offwhite border-2 border-black font-mono text-sm font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(230,59,46,1)] transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="font-mono text-xs font-black uppercase tracking-widest text-black/50">Contact Email</label>
                                    <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 bg-offwhite border-2 border-black font-mono text-sm font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(230,59,46,1)] transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="font-mono text-xs font-black uppercase tracking-widest text-black/50">Website</label>
                                    <input value={website} onChange={(e) => setWebsite(e.target.value)} className="w-full px-4 py-3 bg-offwhite border-2 border-black font-mono text-sm font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(230,59,46,1)] transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="font-mono text-xs font-black uppercase tracking-widest text-black/50">Phone</label>
                                    <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(XXX) XXX-XXXX" className="w-full px-4 py-3 bg-offwhite border-2 border-black font-mono text-sm font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(230,59,46,1)] transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="font-mono text-xs font-black uppercase tracking-widest text-black/50">EIN</label>
                                    <input value={ein} onChange={(e) => setEin(e.target.value)} className="w-full px-4 py-3 bg-offwhite border-2 border-black font-mono text-sm font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(230,59,46,1)] transition-all" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="font-mono text-xs font-black uppercase tracking-widest text-black/50">Address</label>
                                <input value={address} onChange={(e) => setAddress(e.target.value)} className="w-full px-4 py-3 bg-offwhite border-2 border-black font-mono text-sm font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(230,59,46,1)] transition-all" />
                            </div>
                        </div>
                    </section>

                    {/* Email Generation Settings */}
                    <section className="border-4 border-black bg-white shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] overflow-hidden">
                        <div className="px-6 py-4 border-b-4 border-black bg-black text-white flex items-center gap-3">
                            <Mail className="w-5 h-5" />
                            <h2 className="font-heading font-black text-base uppercase tracking-widest">Email Generation</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="font-mono text-xs font-black uppercase tracking-widest text-black/50">Your Name</label>
                                    <input value={senderName} onChange={(e) => setSenderName(e.target.value)} placeholder="e.g., Javi" className="w-full px-4 py-3 bg-offwhite border-2 border-black font-mono text-sm font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(230,59,46,1)] transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="font-mono text-xs font-black uppercase tracking-widest text-black/50">Your Title</label>
                                    <input value={senderTitle} onChange={(e) => setSenderTitle(e.target.value)} placeholder="e.g., Executive Director" className="w-full px-4 py-3 bg-offwhite border-2 border-black font-mono text-sm font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(230,59,46,1)] transition-all" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="font-mono text-xs font-black uppercase tracking-widest text-black/50">Custom AI Instructions</label>
                                <textarea
                                    value={customInstructions}
                                    onChange={(e) => setCustomInstructions(e.target.value)}
                                    rows={4}
                                    className="w-full px-4 py-3 bg-offwhite border-2 border-black font-mono text-sm leading-relaxed focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(230,59,46,1)] transition-all resize-none"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Save Button */}
                    <button
                        onClick={handleSave}
                        className="w-full py-4 bg-black text-white border-4 border-black font-heading text-lg font-black uppercase tracking-widest hover:bg-signal transition-all shadow-[6px_6px_0px_0px_rgba(230,59,46,1)] hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px] flex items-center justify-center gap-3"
                    >
                        {saved ? <><CheckCircle2 className="w-5 h-5" /> Saved!</> : <><Save className="w-5 h-5" /> Save Settings</>}
                    </button>
                </div>
            </main >
        </div >
    );
}
