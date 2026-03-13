"use client";

import React, { useMemo, useState } from "react";
import { Grant } from "@/types/grant";
import { AlertTriangle, Bell, X, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Props {
    grants: Grant[];
}

interface UpcomingDeadline {
    grant: Grant;
    deadlineDate: Date;
    deadlineType: "LOI" | "Proposal";
    daysUntil: number;
}

const getAction = (d: UpcomingDeadline): string => {
    const label = d.deadlineType === "LOI" ? "LOI" : "Proposal";
    const timeLeft = formatDistanceToNow(d.deadlineDate, { addSuffix: true });
    return `${label} deadline for ${d.grant.funderName} — ${d.grant.projectLinked} (${timeLeft})`;
};

export const PriorityAlertBanner = ({ grants }: Props) => {
    const [dismissed, setDismissed] = useState(false);

    const upcoming = useMemo(() => {
        const now = new Date();
        const horizon = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days out
        const deadlines: UpcomingDeadline[] = [];

        for (const grant of grants) {
            if (grant.status === "archived" || grant.status === "deleted") continue;

            if (grant.loiDeadline) {
                const d = new Date(grant.loiDeadline);
                if (d >= now && d <= horizon) {
                    deadlines.push({
                        grant,
                        deadlineDate: d,
                        deadlineType: "LOI",
                        daysUntil: Math.ceil((d.getTime() - now.getTime()) / (1000 * 3600 * 24)),
                    });
                }
            }

            if (grant.proposalDeadline) {
                const d = new Date(grant.proposalDeadline);
                if (d >= now && d <= horizon) {
                    deadlines.push({
                        grant,
                        deadlineDate: d,
                        deadlineType: "Proposal",
                        daysUntil: Math.ceil((d.getTime() - now.getTime()) / (1000 * 3600 * 24)),
                    });
                }
            }
        }

        return deadlines.sort((a, b) => a.daysUntil - b.daysUntil);
    }, [grants]);

    if (upcoming.length === 0 || dismissed) return null;

    const urgentCount = upcoming.filter((d) => d.daysUntil <= 7).length;
    const funderNames = [...new Set(upcoming.map((d) => d.grant.funderName))];

    return (
        <div className="mb-8 border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(230,59,46,1)] animate-in slide-in-from-top-4 duration-300 relative overflow-hidden">
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)', backgroundSize: '10px 10px' }}></div>

            <div className="relative z-10 flex flex-col md:flex-row">
                <div className="bg-signal text-white p-6 border-b-4 md:border-b-0 md:border-r-4 border-black flex flex-col items-center justify-center shrink-0 min-w-[200px]">
                    <Bell className="w-10 h-10 mb-2 animate-pulse" />
                    <h3 className="font-heading font-black text-xl uppercase text-center tracking-tight leading-none">
                        Upcoming<br />Deadlines
                    </h3>
                </div>

                <div className="p-6 flex-1 text-black">
                    <div className="flex justify-between items-start mb-4">
                        <p className="font-mono text-sm leading-relaxed max-w-2xl font-bold">
                            <span className="text-signal mr-2">{"//"}</span>
                            {upcoming.length} deadline{upcoming.length !== 1 ? "s" : ""} in the next 30 days
                            {urgentCount > 0 ? ` (${urgentCount} this week)` : ""}
                            {" — "}{funderNames.join(", ")}.
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
                            Action Required
                        </h4>
                        <ul className="space-y-2">
                            {upcoming.map((d, idx) => (
                                <li key={idx} className="font-mono text-sm flex gap-3 items-start">
                                    <span className={d.daysUntil <= 7 ? "text-signal font-black" : "text-black/40 font-black"}>
                                        {d.daysUntil <= 7 ? <AlertTriangle className="w-4 h-4 inline" /> : <Clock className="w-4 h-4 inline" />}
                                    </span>
                                    <span className={d.daysUntil <= 7 ? "font-bold" : ""}>{getAction(d)}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};
