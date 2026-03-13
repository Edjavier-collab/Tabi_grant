"use client";

import React, { useEffect, useState } from "react";
import { ActivityLog } from "@/types/activity";
import { subscribeToActivity } from "@/lib/firebase/db";
import { 
    History, 
    PlusCircle, 
    Archive, 
    RotateCcw, 
    Trash2, 
    ArrowRightCircle, 
    ChevronDown, 
    ChevronUp,
    Clock
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const activityConfig = {
    created: {
        icon: PlusCircle,
        color: "text-signal",
        bg: "bg-signal/5"
    },
    stage_change: {
        icon: ArrowRightCircle,
        color: "text-blue-600",
        bg: "bg-blue-50"
    },
    archived: {
        icon: Archive,
        color: "text-amber-600",
        bg: "bg-amber-50"
    },
    restored: {
        icon: RotateCcw,
        color: "text-emerald-600",
        bg: "bg-emerald-50"
    },
    deleted: {
        icon: Trash2,
        color: "text-red-600",
        bg: "bg-red-50"
    },
    updated: {
        icon: History,
        color: "text-gray-600",
        bg: "bg-gray-50"
    }
};

export const ActivityFeed = () => {
    const [logs, setLogs] = useState<ActivityLog[]>([]);
    const [collapsed, setCollapsed] = useState(false);

    useEffect(() => {
        const unsubscribe = subscribeToActivity((data) => {
            setLogs(data);
        });
        return () => unsubscribe();
    }, []);

    if (logs.length === 0) return null;

    return (
        <div className="mb-8 border-4 border-black bg-white shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] overflow-hidden">
            {/* Header */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="w-full flex items-center justify-between px-6 py-4 border-b-4 border-black bg-white text-black hover:bg-offwhite transition-colors"
            >
                <h3 className="font-heading font-black text-base uppercase tracking-widest flex items-center gap-3">
                    <History className="w-5 h-5" />
                    System Activity
                    <span className="bg-black text-white text-[10px] px-2 py-0.5 font-mono">
                        LIVE
                    </span>
                </h3>
                {collapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
            </button>

            {/* Items */}
            {!collapsed && (
                <div className="max-h-[300px] overflow-y-auto divide-y-2 divide-black/5 scrollbar-brutalist">
                    {logs.map((log) => {
                        const config = activityConfig[log.type] || activityConfig.updated;
                        const Icon = config.icon;

                        return (
                            <div
                                key={log.id}
                                className={`flex items-start gap-4 px-6 py-4 ${config.bg} transition-colors hover:brightness-95`}
                            >
                                <div className={`mt-1 p-1.5 border-2 border-black bg-white ${config.color} shrink-0`}>
                                    <Icon className="w-4 h-4 stroke-[3]" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2 mb-1">
                                        <span className="font-mono text-[10px] font-black uppercase tracking-widest text-black/40 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                                        </span>
                                        <span className="font-mono text-[10px] font-black uppercase tracking-widest bg-black/5 px-1.5">
                                            {log.funderName}
                                        </span>
                                    </div>
                                    <p className="font-mono text-xs font-bold text-black leading-relaxed">
                                        {log.details}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
