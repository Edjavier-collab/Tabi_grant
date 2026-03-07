"use client";

import React from "react";
import { FollowupItem } from "@/hooks/useFollowups";
import { X, Copy, ExternalLink } from "lucide-react";

interface Props {
    item: FollowupItem | null;
    isOpen: boolean;
    onClose: () => void;
}

const TEMPLATES: Record<string, (name: string, days: number) => { subject: string; body: string }> = {
    follow_up_1: (name, days) => ({
        subject: `Following Up — Tabi Po Foundation LOI Submission`,
        body: `Dear ${name} Program Team,

I hope this message finds you well. I am writing to kindly follow up on the Letter of Inquiry we submitted ${days} days ago on behalf of the Tabi Po Foundation for our Roots & Rivers watershed restoration project.

We remain deeply enthusiastic about the possibility of partnering with ${name} and would be happy to provide any additional information that may be helpful for your review.

Thank you for your time and consideration.

Warm regards,
Tabi Po Foundation`,
    }),
    follow_up_2: (name, days) => ({
        subject: `Second Follow-Up — Tabi Po Foundation LOI (${days} Days)`,
        body: `Dear ${name} Program Team,

I am reaching out once more regarding the Letter of Inquiry submitted by the Tabi Po Foundation ${days} days ago. We understand your team is managing many proposals and appreciate the time it takes to review them.

If there is any additional documentation, budget detail, or project information we can provide to support your review process, please do not hesitate to let us know.

We look forward to hearing from you at your earliest convenience.

Respectfully,
Tabi Po Foundation`,
    }),
    status_check: (name, days) => ({
        subject: `Proposal Status Inquiry — Tabi Po Foundation`,
        body: `Dear ${name} Program Team,

I am writing to respectfully inquire about the status of our full proposal submitted ${days} days ago. We understand the review process takes time and appreciate your thorough consideration.

Should you require any supplementary materials or clarifications, we are happy to provide them promptly.

Thank you for your continued consideration.

Best regards,
Tabi Po Foundation`,
    }),
    re_engage: (name, days) => ({
        subject: `Staying Connected — Tabi Po Foundation Update`,
        body: `Dear ${name} Team,

It has been a while since our last correspondence (${days} days), and I wanted to share a brief update on the progress of our conservation work in Northern Negros.

We would welcome the opportunity to reconnect and explore how our efforts align with ${name}'s current priorities.

Looking forward to hearing from you.

Warm regards,
Tabi Po Foundation`,
    }),
    report_due: (name, _days) => ({
        subject: `Upcoming Report Submission — Tabi Po Foundation`,
        body: `Dear ${name} Program Team,

This is to confirm that we are preparing the required report for our current grant period and will submit it ahead of the upcoming deadline.

Please let us know if there are any specific formatting requirements or additional data points you would like included.

Thank you for your partnership.

Best regards,
Tabi Po Foundation`,
    }),
};

export const EmailDraftPreview = ({ item, isOpen, onClose }: Props) => {
    if (!isOpen || !item) return null;

    const templateFn = TEMPLATES[item.type] || TEMPLATES.follow_up_1;
    const { subject, body } = templateFn(item.grant.funderName, item.daysSince);

    const handleCopy = () => {
        navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`);
        alert("Email draft copied to clipboard!");
    };

    const handleOpenGmail = () => {
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.open(gmailUrl, "_blank");
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md text-black">
            <div className="w-full max-w-2xl bg-white border-4 border-black shadow-[16px_16px_0px_0px_rgba(17,17,17,1)] overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b-4 border-black bg-black text-white">
                    <h2 className="font-heading text-xl font-black uppercase tracking-tighter">
                        Email Draft Preview
                    </h2>
                    <button
                        onClick={onClose}
                        className="flex h-10 w-10 items-center justify-center border-2 border-white/30 bg-transparent text-white transition-all hover:bg-signal hover:border-signal"
                    >
                        <X className="w-5 h-5 stroke-[3]" />
                    </button>
                </div>

                <div className="p-8 space-y-6 bg-offwhite relative">
                    <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>

                    <div className="relative z-10 space-y-4">
                        {/* To */}
                        <div className="flex items-center gap-4">
                            <span className="font-mono text-xs font-black uppercase tracking-widest text-black/50 w-16">To:</span>
                            <span className="font-mono text-sm font-bold text-black/70">
                                {item.grant.primaryContact?.email || `${item.grant.funderName.toLowerCase().replace(/\s+/g, "")}@foundation.org`}
                            </span>
                        </div>

                        {/* Subject */}
                        <div className="flex items-center gap-4">
                            <span className="font-mono text-xs font-black uppercase tracking-widest text-black/50 w-16">Subject:</span>
                            <span className="font-mono text-sm font-bold">{subject}</span>
                        </div>

                        {/* Body */}
                        <div className="bg-white border-2 border-black p-6 font-mono text-sm leading-relaxed whitespace-pre-wrap max-h-[400px] overflow-y-auto">
                            {body}
                        </div>

                        <p className="font-mono text-xs text-black/40 italic">
                            // Future enhancement: Gemini will generate context-aware drafts using grant history and donor persona.
                        </p>

                        {/* Actions */}
                        <div className="pt-4 flex gap-4">
                            <button
                                onClick={handleCopy}
                                className="flex items-center gap-2 px-6 py-4 bg-white text-black border-2 border-black font-heading text-sm font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]"
                            >
                                <Copy className="w-4 h-4" /> Copy
                            </button>
                            <button
                                onClick={handleOpenGmail}
                                className="flex-1 flex items-center justify-center gap-2 py-4 bg-signal text-white border-2 border-black font-heading text-sm font-black uppercase tracking-widest hover:bg-black transition-all shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]"
                            >
                                <ExternalLink className="w-4 h-4" /> Open in Gmail
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
