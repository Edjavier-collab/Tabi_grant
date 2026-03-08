"use client";

import React, { useEffect, useState } from "react";
import { Mail, ExternalLink, Loader2, RefreshCw, Search, Inbox, PenTool } from "lucide-react";
import { useGmail } from "@/hooks/useGoogleWorkspace";

interface GmailThread {
    id: string;
    subject: string;
    from: string;
    snippet: string;
    date: string;
    labels: string[];
}

interface Props {
    funderNames?: string[];
}

export const InboxPanel = ({ funderNames = [] }: Props) => {
    const [threads, setThreads] = useState<GmailThread[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [connected, setConnected] = useState(true); // Assume connected until proven otherwise
    const [drafting, setDrafting] = useState(false);
    const { createDraft } = useGmail();

    const fetchInbox = async (query?: string) => {
        setLoading(true);
        setError(null);
        try {
            // Build search query from funder names or user input
            const q = query || (funderNames.length > 0
                ? funderNames.map((n) => `from:${n} OR subject:${n}`).join(" OR ")
                : "label:inbox is:unread");

            const res = await fetch(`/api/gmail/inbox?q=${encodeURIComponent(q)}`);
            const data = await res.json();

            if (res.status === 401) {
                setConnected(false);
                setError("Gmail not connected. Go to Settings to connect.");
                return;
            }

            if (data.error) {
                setError(data.error);
            } else {
                setThreads(data.threads || []);
            }
        } catch (err) {
            setError("Failed to fetch inbox");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInbox();
    }, []);

    const formatDate = (dateStr: string) => {
        try {
            const d = new Date(dateStr);
            const now = new Date();
            const diffMs = now.getTime() - d.getTime();
            const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
            if (diffHours < 1) return "Just now";
            if (diffHours < 24) return `${diffHours}h ago`;
            const diffDays = Math.floor(diffHours / 24);
            if (diffDays < 7) return `${diffDays}d ago`;
            return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        } catch {
            return dateStr;
        }
    };

    const extractName = (from: string) => {
        const match = from.match(/^"?([^"<]+)"?\s*</);
        return match ? match[1].trim() : from.split("@")[0];
    };

    if (!connected) {
        return (
            <div className="border-4 border-black bg-white shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] overflow-hidden mb-8">
                <div className="px-6 py-4 border-b-4 border-black bg-black text-white flex items-center gap-3">
                    <Mail className="w-5 h-5" />
                    <h3 className="font-heading font-black text-base uppercase tracking-widest">Grant Inbox</h3>
                </div>
                <div className="p-8 text-center space-y-4">
                    <Inbox className="w-12 h-12 mx-auto text-black/20 stroke-1" />
                    <p className="font-mono text-sm text-black/50">Gmail not connected.</p>
                    <a
                        href="/dashboard/settings"
                        className="inline-block px-6 py-3 bg-signal text-white border-2 border-black font-heading text-sm font-black uppercase tracking-widest hover:bg-black transition-all shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]"
                    >
                        Connect in Settings
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="border-4 border-black bg-white shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] overflow-hidden mb-8">
            {/* Header */}
            <div className="px-6 py-4 border-b-4 border-black bg-black text-white flex items-center gap-3">
                <Mail className="w-5 h-5" />
                <h3 className="font-heading font-black text-base uppercase tracking-widest flex-1">Grant Inbox</h3>
                <span className="font-mono text-xs bg-signal px-2 py-0.5">{threads.length} emails</span>
                <button
                    onClick={() => fetchInbox(searchQuery || undefined)}
                    className="p-1.5 hover:bg-signal transition-colors"
                    title="Refresh"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                </button>
            </div>

            {/* Search and Actions */}
            <div className="flex items-center gap-4 px-4 py-3 border-b-2 border-black bg-offwhite">
                <div className="flex-1 flex items-center gap-2">
                    <Search className="w-4 h-4 text-black/40" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && fetchInbox(searchQuery)}
                        placeholder="Search inbox..."
                        className="flex-1 bg-transparent font-mono text-sm outline-none placeholder:text-black/30 w-full"
                    />
                </div>
                {funderNames.length > 0 && (
                    <button
                        onClick={async () => {
                            setDrafting(true);
                            try {
                                await createDraft(
                                    funderNames[0].toLowerCase().replace(/\s+/g, '') + "@example.org",
                                    `Grant Update: ${funderNames[0]}`,
                                    `
                                    <div style="font-family: monospace; color: #111; line-height: 1.6; max-width: 800px; margin: 0 auto;">
                                        <div style="text-align: center; border-bottom: 4px solid #111; padding-bottom: 10px; margin-bottom: 10px;">
                                            <img src="https://tabipofoundation.org/Logo/tabi_po_foundation_logo.png" alt="Tabi Po Foundation Logo" style="width: 100%; max-width: 800px; max-height: 320px; object-fit: contain;" />
                                        </div>
                                        <p style="font-size: 14px;"><strong>Hello,</strong></p>
                                        <p style="font-size: 14px;">We wanted to provide a quick update on our recent grant progress...</p>
                                        <br/>
                                        <p style="font-size: 14px; font-weight: bold;">Best regards,</p>
                                        <p style="font-size: 14px;">Tabi Po Foundation</p>
                                    </div>
                                    `,
                                    true
                                );
                                alert("Draft created successfully in Gmail!");
                            } catch (e) {
                                alert("Failed to create draft");
                            }
                            setDrafting(false);
                        }}
                        disabled={drafting}
                        className="flex items-center gap-2 bg-black text-white px-3 py-1.5 font-mono text-xs font-black uppercase tracking-widest hover:bg-[#FF3500] hover:text-black transition-colors border-2 border-black shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] whitespace-nowrap"
                    >
                        {drafting ? <Loader2 className="w-3 h-3 animate-spin" /> : <PenTool className="w-3 h-3" />}
                        {drafting ? "Drafting..." : "Draft Follow-Up"}
                    </button>
                )}
            </div>

            {/* Content */}
            <div className="max-h-[400px] overflow-y-auto divide-y divide-black/10">
                {loading && (
                    <div className="flex items-center justify-center p-8 gap-3">
                        <Loader2 className="w-5 h-5 animate-spin text-signal" />
                        <span className="font-mono text-sm text-black/50">Scanning inbox...</span>
                    </div>
                )}

                {error && (
                    <div className="p-6 text-center">
                        <p className="font-mono text-sm text-signal font-bold">{error}</p>
                    </div>
                )}

                {!loading && !error && threads.length === 0 && (
                    <div className="p-8 text-center">
                        <Inbox className="w-10 h-10 mx-auto text-black/15 mb-2" />
                        <p className="font-mono text-sm text-black/40">No matching emails found.</p>
                    </div>
                )}

                {!loading && threads.map((thread) => {
                    const isUnread = thread.labels.includes("UNREAD");
                    return (
                        <div
                            key={thread.id}
                            className={`flex items-start gap-4 px-6 py-4 hover:bg-offwhite transition-colors cursor-pointer group ${isUnread ? "bg-signal/5" : ""}`}
                        >
                            <div className={`mt-1.5 w-2.5 h-2.5 rounded-full shrink-0 ${isUnread ? "bg-signal" : "bg-black/10"}`}></div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-baseline gap-2 mb-0.5">
                                    <span className={`font-mono text-sm truncate ${isUnread ? "font-black" : "font-bold text-black/70"}`}>
                                        {extractName(thread.from)}
                                    </span>
                                    <span className="font-mono text-[10px] text-black/40 uppercase shrink-0">
                                        {formatDate(thread.date)}
                                    </span>
                                </div>
                                <p className={`font-mono text-sm truncate ${isUnread ? "font-bold" : "text-black/60"}`}>
                                    {thread.subject}
                                </p>
                                <p className="font-mono text-xs text-black/40 truncate mt-0.5">
                                    {thread.snippet}
                                </p>
                            </div>
                            <a
                                href={`https://mail.google.com/mail/u/0/#inbox/${thread.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:text-signal shrink-0"
                                title="Open in Gmail"
                            >
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
