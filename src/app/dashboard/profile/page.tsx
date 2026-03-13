"use client";

import React, { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { User, Mail, Calendar, Settings, CheckCircle2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
    const { user } = useAuth();
    
    // Gmail/Workspace status
    const searchParams = useSearchParams();
    const [workspaceConnected, setWorkspaceConnected] = useState(false);
    const [isCheckingWorkspace, setIsCheckingWorkspace] = useState(true);

    useEffect(() => {
        // Immediate visual feedback if returning from OAuth
        if (searchParams.get("workspace") === "connected") {
            setWorkspaceConnected(true);
            setIsCheckingWorkspace(false);
            return;
        }

        // Otherwise, ask the backend if we have tokens
        const checkStatus = async () => {
            try {
                const res = await fetch("/api/auth/gmail/status");
                if (res.ok) {
                    const data = await res.json();
                    setWorkspaceConnected(!!data.connected);
                }
            } catch (error) {
                console.error("Failed to check Workspace status", error);
            } finally {
                setIsCheckingWorkspace(false);
            }
        };

        checkStatus();
    }, [searchParams]);

    return (
        <div className="flex flex-col h-screen bg-paper font-mono">
            <DashboardHeader title="User Profile" />

            <main className="flex-1 overflow-auto p-8">
                <div className="max-w-3xl mx-auto space-y-8">

                    {/* Firebase Credentials */}
                    <section className="border-4 border-black bg-white shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] overflow-hidden">
                        <div className="px-6 py-4 border-b-4 border-black bg-black text-white flex items-center gap-3">
                            <User className="w-5 h-5" />
                            <h2 className="font-heading font-black text-base uppercase tracking-widest">Account Details</h2>
                        </div>
                        <div className="p-6 flex flex-col md:flex-row gap-6 items-center md:items-start">
                            {user?.photoURL ? (
                                <img src={user.photoURL} alt="Profile" className="h-24 w-24 border-4 border-black shadow-[4px_4px_0px_0px_rgba(17,17,17,1)]" />
                            ) : (
                                <div className="h-24 w-24 border-4 border-black bg-offwhite shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] flex items-center justify-center">
                                    <User className="w-8 h-8 text-black/50" />
                                </div>
                            )}
                            <div className="space-y-4 flex-1 w-full">
                                <div className="space-y-1">
                                    <label className="font-mono text-xs font-black uppercase tracking-widest text-black/50">Display Name</label>
                                    <div className="w-full px-4 py-3 bg-offwhite border-2 border-black font-mono text-sm font-bold">
                                        {user?.displayName || "N/A"}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="font-mono text-xs font-black uppercase tracking-widest text-black/50">Email Address</label>
                                    <div className="w-full px-4 py-3 bg-offwhite border-2 border-black font-mono text-sm font-bold">
                                        {user?.email || "N/A"}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="font-mono text-xs font-black uppercase tracking-widest text-black/50">User ID</label>
                                    <div className="w-full px-4 py-3 bg-offwhite border-2 border-black font-mono text-xs text-black/70 truncate">
                                        {user?.uid || "N/A"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Google Workspace Connection */}
                    <section className="border-4 border-black bg-white shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] overflow-hidden">
                        <div className="px-6 py-4 border-b-4 border-black bg-black text-white flex items-center gap-3">
                            <Settings className="w-5 h-5" />
                            <h2 className="font-heading font-black text-base uppercase tracking-widest">Google Workspace Integration</h2>
                        </div>
                        <div className="p-6">
                            {isCheckingWorkspace ? (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 p-4 bg-gray-50 border-2 border-gray-300">
                                        <div className="w-5 h-5 rounded-full border-2 border-gray-400 border-t-transparent animate-spin" />
                                        <span className="font-mono text-sm font-bold text-gray-600">Checking connection status...</span>
                                    </div>
                                </div>
                            ) : workspaceConnected ? (
                                <div className="flex items-center gap-3 p-4 bg-emerald-50 border-2 border-emerald-500">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                    <span className="font-mono text-sm font-bold text-emerald-800">Connected to Google Workspace</span>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 p-4 bg-amber-50 border-2 border-amber-500">
                                        <Calendar className="w-5 h-5 text-amber-600" />
                                        <span className="font-mono text-sm font-bold text-amber-800">Workspace not connected yet</span>
                                    </div>
                                    <p className="font-mono text-xs text-black/50 leading-relaxed">
                                        Connect your Google Workspace to enable inbox monitoring, email classification, automated calendar events, and direct Drive uploads from the dashboard.
                                    </p>
                                    <a
                                        href="/api/auth/gmail"
                                        className="inline-block px-6 py-3 bg-signal text-white border-2 border-black font-heading text-sm font-black uppercase tracking-widest hover:bg-black transition-all shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]"
                                    >
                                        Connect Workspace
                                    </a>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
