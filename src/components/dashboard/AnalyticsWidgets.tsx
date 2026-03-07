"use client";

import React, { useMemo } from "react";
import { Grant } from "@/types/grant";
import { DollarSign, TrendingUp, AlertTriangle, CheckCircle2, Clock, Target } from "lucide-react";

interface Props {
    grants: Grant[];
}

export const AnalyticsWidgets = ({ grants }: Props) => {
    const stats = useMemo(() => {
        const totalGrants = grants.length;
        const totalValue = grants.reduce((sum, g) => sum + g.amountRequested, 0);
        const activeGrants = grants.filter((g) => g.currentStage === "Active Grant");
        const activeValue = activeGrants.reduce((sum, g) => sum + g.amountRequested, 0);
        const prospects = grants.filter((g) => g.currentStage === "Prospect").length;
        const awarded = grants.filter((g) => g.currentStage === "Awarded").length;
        const declined = grants.filter((g) => g.currentStage === "Declined").length;

        // Deadlines this week
        const now = new Date();
        const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        const dueThisWeek = grants.filter((g) => {
            const deadline = g.loiDeadline || g.proposalDeadline;
            if (!deadline) return false;
            const d = new Date(deadline);
            return d >= now && d <= weekFromNow;
        }).length;

        return { totalGrants, totalValue, activeGrants: activeGrants.length, activeValue, prospects, awarded, declined, dueThisWeek };
    }, [grants]);

    const fmt = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

    const cards = [
        { label: "Pipeline", value: `${stats.totalGrants} Grants`, sub: fmt(stats.totalValue) + " total", icon: Target, accent: "bg-black" },
        { label: "Due This Week", value: stats.dueThisWeek.toString(), sub: stats.dueThisWeek > 0 ? "🔴 Action needed" : "✅ Clear", icon: Clock, accent: stats.dueThisWeek > 0 ? "bg-signal" : "bg-emerald-600" },
        { label: "Active Grants", value: stats.activeGrants.toString(), sub: fmt(stats.activeValue) + " value", icon: CheckCircle2, accent: "bg-emerald-600" },
        { label: "Awarded", value: stats.awarded.toString(), sub: `${stats.declined} declined`, icon: TrendingUp, accent: "bg-amber-600" },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {cards.map((card, idx) => {
                const Icon = card.icon;
                return (
                    <div
                        key={idx}
                        className="border-4 border-black bg-white shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] overflow-hidden hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(230,59,46,1)] transition-all"
                    >
                        <div className={`${card.accent} text-white px-4 py-2 flex items-center gap-2`}>
                            <Icon className="w-4 h-4" />
                            <span className="font-mono text-[10px] font-black uppercase tracking-widest">{card.label}</span>
                        </div>
                        <div className="p-4">
                            <div className="font-heading text-3xl font-black text-black leading-none">{card.value}</div>
                            <div className="font-mono text-xs text-black/50 font-bold mt-1 uppercase">{card.sub}</div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
