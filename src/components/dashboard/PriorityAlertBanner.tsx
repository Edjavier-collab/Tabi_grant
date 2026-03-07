"use client";

import React, { useState } from "react";
import { AlertTriangle, Bell, X } from "lucide-react";

// For the MVP, we hardcode the 2026 priority cycles to simulate the alert banner logic.
const PRIORITY_CYCLES = [
    {
        month: 2, // 0-indexed March
        year: 2026,
        name: "Spring LOI",
        foundations: ["Packard", "Moore", "Hewlett"],
        actions: [
            "Finalize Roots & Rivers LOI for Packard (due Mar 15)",
            "Research Moore Foundation spring priorities",
            "Update project metrics for Q1 reporting",
        ]
    },
    {
        month: 5, // 0-indexed June
        year: 2026,
        name: "Summer/Fall Proposal",
        foundations: ["Christensen", "ClimateWorks"],
        actions: [
            "Submit full proposal for Christensen",
            "Prepare mid-year reports"
        ]
    },
    {
        month: 8, // 0-indexed September
        year: 2026,
        name: "Year-End Planning",
        foundations: ["Patagonia", "REI", "Corporate"],
        actions: [
            "Submit end-of-year grant extensions",
            "Pitch REI for next year funding"
        ]
    }
];

export const PriorityAlertBanner = () => {
    const [dismissed, setDismissed] = useState(false);

    // Mocking the current date to force the March 2026 alert for demonstration/testing
    const currentDate = new Date(2026, 2, 1); // March 1, 2026

    const activeCycle = PRIORITY_CYCLES.find(c => {
        // Find if we are within 30 days before or during the target month
        const cycleDate = new Date(c.year, c.month, 15);
        const timeDiff = cycleDate.getTime() - currentDate.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        return daysDiff >= -15 && daysDiff <= 45; // roughly 45 days before, 15 days after
    });

    if (!activeCycle || dismissed) return null;

    return (
        <div className="mb-8 border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(230,59,46,1)] animate-in slide-in-from-top-4 duration-300 relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)', backgroundSize: '10px 10px' }}></div>

            <div className="relative z-10 flex flex-col md:flex-row">
                {/* Alert Header/Icon */}
                <div className="bg-signal text-white p-6 border-b-4 md:border-b-0 md:border-r-4 border-black flex flex-col items-center justify-center shrink-0 min-w-[200px]">
                    <Bell className="w-10 h-10 mb-2 animate-pulse" />
                    <h3 className="font-heading font-black text-xl uppercase text-center tracking-tight leading-none">
                        Priority<br />Cycle Alert
                    </h3>
                </div>

                {/* Alert Content */}
                <div className="p-6 flex-1 text-black">
                    <div className="flex justify-between items-start mb-4">
                        <p className="font-mono text-sm leading-relaxed max-w-2xl font-bold">
                            <span className="text-signal mr-2">{"//"}</span>
                            {activeCycle.name} cycle ({activeCycle.year}) is approaching for {activeCycle.foundations.join(", ")}.
                        </p>
                        <button
                            onClick={() => setDismissed(true)}
                            className="p-1 hover:bg-black hover:text-white border-2 border-transparent hover:border-black transition-colors"
                            title="Dismiss Alert"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="bg-offwhite border-2 border-black p-4">
                        <h4 className="font-mono text-xs font-black uppercase tracking-widest text-black/50 mb-3 flex items-center gap-2">
                            <AlertTriangle className="w-3 h-3" />
                            Recommended Actions
                        </h4>
                        <ul className="space-y-2">
                            {activeCycle.actions.map((action, idx) => (
                                <li key={idx} className="font-mono text-sm flex gap-3 items-start">
                                    <span className="text-signal font-black">→</span>
                                    <span>{action}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="mt-4 flex gap-4">
                        <button className="px-4 py-2 bg-black text-white font-mono text-xs font-bold tracking-widest uppercase hover:bg-signal transition-colors shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]">
                            View All Deadlines
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
