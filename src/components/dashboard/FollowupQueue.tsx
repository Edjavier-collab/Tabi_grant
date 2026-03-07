"use client";

import React, { useState } from "react";
import { FollowupItem } from "@/hooks/useFollowups";
import { Mail, AlertTriangle, AlertCircle, Info, ChevronDown, ChevronUp } from "lucide-react";
import { EmailDraftPreview } from "@/components/emails/EmailDraftPreview";

interface Props {
    items: FollowupItem[];
}

const urgencyConfig = {
    critical: {
        icon: AlertTriangle,
        bg: "bg-signal/10",
        border: "border-signal",
        dot: "bg-signal",
        text: "text-signal",
    },
    warning: {
        icon: AlertCircle,
        bg: "bg-amber-50",
        border: "border-amber-500",
        dot: "bg-amber-500",
        text: "text-amber-700",
    },
    info: {
        icon: Info,
        bg: "bg-blue-50",
        border: "border-blue-400",
        dot: "bg-blue-400",
        text: "text-blue-700",
    },
};

export const FollowupQueue = ({ items }: Props) => {
    const [collapsed, setCollapsed] = useState(false);
    const [emailGrant, setEmailGrant] = useState<FollowupItem | null>(null);

    if (items.length === 0) return null;

    return (
        <>
            <div className="mb-8 border-4 border-black bg-white shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] overflow-hidden">
                {/* Header */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="w-full flex items-center justify-between px-6 py-4 border-b-4 border-black bg-black text-white hover:bg-signal/90 transition-colors"
                >
                    <h3 className="font-heading font-black text-base uppercase tracking-widest flex items-center gap-3">
                        <Mail className="w-5 h-5" />
                        Action Items Today
                        <span className="bg-signal text-white text-xs px-2 py-0.5 border border-white/30 font-mono">
                            {items.length}
                        </span>
                    </h3>
                    {collapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
                </button>

                {/* Items */}
                {!collapsed && (
                    <div className="divide-y-2 divide-black/10">
                        {items.map((item, idx) => {
                            const config = urgencyConfig[item.urgency];
                            const Icon = config.icon;

                            return (
                                <div
                                    key={`${item.grant.id}-${item.type}-${idx}`}
                                    className={`flex items-center justify-between px-6 py-4 ${config.bg} transition-colors hover:brightness-95`}
                                >
                                    <div className="flex items-center gap-4 flex-1 min-w-0">
                                        <div className={`w-2.5 h-2.5 rounded-full ${config.dot} shrink-0 animate-pulse`}></div>
                                        <Icon className={`w-5 h-5 shrink-0 ${config.text}`} />
                                        <span className="font-mono text-sm font-bold truncate text-black">
                                            {item.label}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => setEmailGrant(item)}
                                        className="ml-4 shrink-0 flex items-center gap-2 px-4 py-2 bg-black text-white font-mono text-xs font-bold uppercase tracking-widest hover:bg-signal transition-colors shadow-[2px_2px_0px_0px_rgba(17,17,17,0.3)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
                                    >
                                        <Mail className="w-3.5 h-3.5" />
                                        Draft Email
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Email Draft Modal */}
            <EmailDraftPreview
                item={emailGrant}
                isOpen={!!emailGrant}
                onClose={() => setEmailGrant(null)}
            />
        </>
    );
};
