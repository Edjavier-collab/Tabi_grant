import Link from "next/link";
import { ShieldCheck, Database, Ban, FileText } from "lucide-react";

export const metadata = {
    title: "Terms of Service — Tabi Grants",
    description:
        "Tabi Grants Dashboard terms of service. Authorized use policy for Tabi Po Foundation members managing grant lifecycle operations.",
};

const sections = [
    {
        icon: ShieldCheck,
        label: "Authorization",
        heading: "Authorized Personnel Only",
        body: "Access to the Tabi Grants Dashboard is restricted exclusively to verified members of the Tabi Po Foundation and its authorized partners. Unauthorized access is strictly prohibited. By logging in, you confirm that you are an approved member of the organization. Any account found to be held by an unauthorized individual will be immediately revoked.",
    },
    {
        icon: Database,
        label: "Data Usage",
        heading: "Grant Management Purposes Only",
        body: "All data accessed, processed, or generated within this platform — including grant records, field reports, funder information, FPIC documentation, and AI-generated content — is to be used solely for internal grant management operations of the Tabi Po Foundation. Repurposing of platform data for personal, commercial, or unrelated organizational activities is not permitted.",
    },
    {
        icon: Ban,
        label: "Prohibited Activities",
        heading: "No Unauthorized Scraping or API Misuse",
        body: "Users are expressly prohibited from programmatically scraping, harvesting, or bulk-exporting data from this platform without written authorization from the Tabi Po Foundation leadership. The platform's APIs and backend services are designed for internal operational use only. Misuse of API endpoints, including unauthorized automation, overloading requests, or reverse engineering, constitutes a material breach of these terms.",
    },
    {
        icon: FileText,
        label: "Compliance",
        heading: "Responsibility & Consequences",
        body: "Users are responsible for all activity conducted under their account. Any breach of these terms — including unauthorized access, data misuse, or API abuse — may result in immediate account suspension, revocation of access privileges, and potential escalation to the Tabi Po Foundation Board of Directors. We reserve the right to amend these terms at any time with notice provided via the dashboard.",
    },
];

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-offwhite font-mono selection:bg-signal selection:text-white">
            {/* Top Nav */}
            <nav className="sticky top-0 z-50 border-b-4 border-black bg-offwhite px-6 py-4 flex items-center justify-between">
                <Link href="/" className="font-heading text-xl font-bold tracking-tight text-black hover:text-signal transition-colors">
                    Tabi Grants
                </Link>
                <Link
                    href="/dashboard"
                    className="border-2 border-black px-5 py-2 font-heading text-sm font-black uppercase tracking-wider bg-signal text-white hover:bg-black transition-colors shadow-[3px_3px_0px_0px_rgba(17,17,17,1)]"
                >
                    Dashboard →
                </Link>
            </nav>

            <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">

                {/* Header */}
                <div className="mb-16 border-l-4 border-signal pl-8">
                    <p className="font-mono text-xs uppercase tracking-[0.3em] text-black/40 mb-3">
                        Legal · Usage Protocol
                    </p>
                    <h1 className="font-heading text-5xl md:text-7xl font-bold tracking-tight text-black leading-none mb-6">
                        Terms of<br />
                        <span className="font-drama italic text-signal">Service.</span>
                    </h1>
                    <p className="font-mono text-sm text-black/60 max-w-xl">
                        Last updated:{" "}
                        {new Date().toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </p>
                </div>

                {/* Summary Banner */}
                <div className="mb-16 border-4 border-black bg-black text-paper p-8 shadow-[8px_8px_0px_0px_rgba(230,59,46,1)]">
                    <p className="font-mono text-xs uppercase tracking-[0.25em] text-signal mb-4">
                        — Summary
                    </p>
                    <p className="font-heading text-xl md:text-2xl font-bold leading-snug">
                        This platform is for authorized Tabi Po Foundation members only.
                        All data is used exclusively for grant management.
                        Unauthorized access, scraping, or API misuse is strictly prohibited.
                    </p>
                </div>

                {/* Sections Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                    {sections.map((s) => {
                        const Icon = s.icon;
                        return (
                            <div
                                key={s.label}
                                className="border-4 border-black bg-white shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(230,59,46,1)] transition-all overflow-hidden"
                            >
                                <div className="bg-black text-paper px-5 py-3 flex items-center gap-3">
                                    <Icon className="w-4 h-4 text-signal" />
                                    <span className="font-mono text-[10px] font-black uppercase tracking-widest">
                                        {s.label}
                                    </span>
                                </div>
                                <div className="p-6">
                                    <h2 className="font-heading text-lg font-black text-black mb-3">
                                        {s.heading}
                                    </h2>
                                    <p className="font-mono text-sm text-black/70 leading-relaxed">
                                        {s.body}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Contact */}
                <div className="border-t-4 border-black pt-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div>
                        <p className="font-mono text-xs uppercase tracking-widest text-black/40 mb-1">
                            Questions?
                        </p>
                        <p className="font-heading text-base font-black text-black">
                            Reach the Tabi Po Foundation team.
                        </p>
                    </div>
                    <a
                        href="mailto:contact@tabipo.org"
                        className="border-2 border-black px-6 py-3 font-heading text-sm font-black uppercase tracking-wider bg-white hover:bg-signal hover:text-white hover:border-signal transition-all shadow-[4px_4px_0px_0px_rgba(17,17,17,1)]"
                    >
                        Contact Us
                    </a>
                </div>
            </div>

            {/* Footer strip */}
            <footer className="border-t-4 border-black bg-black text-paper px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-widest text-paper/40">
                <span>© {new Date().getFullYear()} Tabi Po Foundation. All rights reserved.</span>
                <div className="flex gap-6">
                    <Link href="/privacy" className="hover:text-signal transition-colors">
                        Privacy Policy
                    </Link>
                    <Link href="/" className="hover:text-signal transition-colors">
                        ← Back to Home
                    </Link>
                </div>
            </footer>
        </main>
    );
}
