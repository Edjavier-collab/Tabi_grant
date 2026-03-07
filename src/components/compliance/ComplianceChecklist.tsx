"use client";

import React, { useMemo } from "react";
import { Grant } from "@/types/grant";
import { ShieldCheck, Circle, CheckCircle2, AlertTriangle, Clock } from "lucide-react";

interface Props {
    grant: Grant;
}

interface CheckItem {
    label: string;
    status: "done" | "upcoming" | "not_due";
    detail?: string;
}

export const ComplianceChecklist = ({ grant }: Props) => {
    const items: CheckItem[] = useMemo(() => {
        const list: CheckItem[] = [];

        // FPIC
        list.push({
            label: "FPIC Consent Logged",
            status: grant.fpicConsentDate ? "done" : "upcoming",
            detail: grant.fpicConsentDate
                ? `Logged ${new Date(grant.fpicConsentDate).toLocaleDateString()}`
                : "Required before Active status",
        });

        // MOA
        list.push({
            label: "MOA/Agreement Signed",
            status: grant.currentStage === "Active Grant" || grant.currentStage === "Closed" ? "done" : "not_due",
        });

        // Budget Tracking
        list.push({
            label: "Budget Tracking Sheet Created",
            status: grant.currentStage === "Active Grant" ? "done" : "not_due",
        });

        // Reports (simulated schedule)
        const grantDate = new Date(grant.createdAt);
        const now = new Date();
        const monthsActive = Math.floor((now.getTime() - grantDate.getTime()) / (1000 * 60 * 60 * 24 * 30));

        list.push({
            label: "Quarterly Report Q1",
            status: monthsActive >= 3 ? "upcoming" : "not_due",
            detail: monthsActive >= 3 ? "Due soon" : undefined,
        });

        list.push({
            label: "Quarterly Report Q2",
            status: monthsActive >= 6 ? "upcoming" : "not_due",
        });

        list.push({
            label: "Mid-Year Site Visit",
            status: "not_due",
        });

        list.push({
            label: "Annual Narrative Report",
            status: "not_due",
        });

        list.push({
            label: "Final Report",
            status: "not_due",
        });

        return list;
    }, [grant]);

    const statusConfig = {
        done: { icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50", label: "Done" },
        upcoming: { icon: Clock, color: "text-amber-600", bg: "bg-amber-50", label: "Upcoming" },
        not_due: { icon: Circle, color: "text-black/20", bg: "bg-transparent", label: "Not Due" },
    };

    return (
        <div className="border-4 border-black bg-white shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] overflow-hidden">
            <div className="px-6 py-4 border-b-4 border-black bg-black text-white flex items-center gap-3">
                <ShieldCheck className="w-5 h-5" />
                <h3 className="font-heading font-black text-base uppercase tracking-widest">Compliance Checklist</h3>
                <span className="ml-auto font-mono text-xs bg-signal px-2 py-0.5">{grant.funderName}</span>
            </div>

            <div className="p-4">
                <div className="font-mono text-xs text-black/40 mb-4 uppercase tracking-widest">
                    Grant: {grant.projectLinked} • ${grant.amountRequested.toLocaleString()}
                </div>

                <div className="space-y-1">
                    {items.map((item, idx) => {
                        const config = statusConfig[item.status];
                        const Icon = config.icon;
                        return (
                            <div
                                key={idx}
                                className={`flex items-center gap-3 px-4 py-3 ${config.bg} border-l-4 ${item.status === "done" ? "border-emerald-500" :
                                        item.status === "upcoming" ? "border-amber-500" :
                                            "border-transparent"
                                    } transition-colors`}
                            >
                                <Icon className={`w-5 h-5 shrink-0 ${config.color}`} />
                                <span className="font-mono text-sm font-bold flex-1">{item.label}</span>
                                <span className={`font-mono text-[10px] font-bold uppercase tracking-widest ${config.color}`}>
                                    {item.detail || config.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
