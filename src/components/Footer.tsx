"use client";

import React from "react";
import { Mail } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Footer() {
    const { user, signInWithGoogle } = useAuth();
    const router = useRouter();

    return (
        <>
            {/* Get Started / Login Section */}
            <section className="bg-signal py-32 px-6 flex flex-col items-center justify-center text-center text-offwhite border-t border-black/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
                <div className="relative z-10 max-w-3xl space-y-8">
                    <h2 className="font-heading text-5xl md:text-7xl font-bold tracking-tight">
                        Initiate Access.
                    </h2>
                    <p className="font-drama italic text-2xl md:text-3xl text-offwhite/80">
                        Secure entry point for Tabi Po foundation delegates.
                    </p>
                    <button
                        onClick={user ? () => router.push('/dashboard') : signInWithGoogle}
                        className="group relative overflow-hidden rounded-[2rem] bg-black px-10 py-5 font-heading font-medium text-white transition-all hover:scale-105 mx-auto flex items-center gap-3"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            <Mail className="h-5 w-5" />
                            {user ? 'Go to Dashboard' : 'Email Login'}
                        </span>
                        <span className="absolute inset-0 z-0 translate-y-[100%] bg-white/20 transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:translate-y-0"></span>
                    </button>
                </div>
            </section>

            {/* Actual Footer */}
            <footer className="bg-black text-paper rounded-t-[4rem] px-8 py-16 md:p-24 pb-8 border-t border-paper/10 -mt-10 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-24">
                    <div className="col-span-1 md:col-span-2 space-y-6">
                        <div className="font-heading text-3xl font-bold tracking-tight">Tabi Grants.</div>
                        <p className="font-mono text-sm text-paper/50 max-w-sm">
                            The internal command center for the Tabi Po Foundation. Precision tools for high-impact conservation funding.
                        </p>
                        {/* Status Indicator */}
                        <div className="inline-flex items-center gap-3 bg-paper/10 px-4 py-2 rounded-full mt-4">
                            <div className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                            </div>
                            <span className="font-mono text-xs tracking-wider uppercase">System Operational</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="font-mono text-xs tracking-widest uppercase text-paper/40 mb-6">Directory</div>
                        <a href="#" className="block font-heading text-sm hover:text-signal transition-colors">Pipeline Tracker</a>
                        <a href="#" className="block font-heading text-sm hover:text-signal transition-colors">Evidence Locker</a>
                        <a href="#" className="block font-heading text-sm hover:text-signal transition-colors">Compliance Engine</a>
                        <a href="#" className="block font-heading text-sm hover:text-signal transition-colors">Calendar Hub</a>
                    </div>

                    <div className="space-y-4">
                        <div className="font-mono text-xs tracking-widest uppercase text-paper/40 mb-6">Internal</div>
                        <a href="#" className="block font-heading text-sm hover:text-signal transition-colors">Help & Docs</a>
                        <a href="#" className="block font-heading text-sm hover:text-signal transition-colors">System Settings</a>
                        <a href="#" className="block font-heading text-sm hover:text-signal transition-colors">Logout</a>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-paper/10 font-mono text-[10px] text-paper/30 gap-4">
                    <div>© {new Date().getFullYear()} Tabi Po Foundation. All rights reserved.</div>
                    <div className="flex gap-6">
                        <a href="/privacy" className="hover:text-paper">Privacy Protocol</a>
                        <a href="/terms" className="hover:text-paper">Terms of Service</a>
                    </div>
                </div>
            </footer>
        </>
    );
}
