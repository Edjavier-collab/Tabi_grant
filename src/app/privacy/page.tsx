import Link from "next/link";
import { Shield, Eye, UserCheck, Lock } from "lucide-react";

export const metadata = {
    title: "Privacy Policy — Tabi Grants",
    description:
        "Tabi Grants Dashboard privacy policy. We use Google OAuth for authentication only and do not store or share your personal data with third parties.",
};

const sections = [
    {
        icon: Shield,
        label: "Authentication",
        heading: "Google OAuth — Identity Only",
        body: "Tabi Grants Dashboard uses Google OAuth exclusively for user authentication. When you sign in, Google securely verifies your identity and returns your name and email address to display in the dashboard. No passwords are stored on our servers.",
    },
    {
        icon: Eye,
        label: "Data Usage",
        heading: "What We Access",
        body: "We access your email address and display name solely to provide a personalized dashboard experience. This information is used to identify your session and is never sold, rented, or shared with any third parties.",
    },
    {
        icon: UserCheck,
        label: "Third Parties",
        heading: "No Third-Party Sharing",
        body: "We do not share your personal data with third parties. Your Google account information stays within the Tabi Po Foundation's internal systems and is not disclosed to funders, partners, or any external organizations.",
    },
    {
        icon: Lock,
        label: "Data Storage",
        heading: "Minimal Storage",
        body: "User session tokens are stored in secure, HTTP-only cookies that expire within 30 days. We store only the minimum data required for the application to function — your user ID and display name in Firebase Authentication.",
    },
];

export default function PrivacyPage() {
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
                        Legal · Privacy Protocol
                    </p>
                    <h1 className="font-heading text-5xl md:text-7xl font-bold tracking-tight text-black leading-none mb-6">
                        Privacy<br />
                        <span className="font-drama italic text-signal">Policy.</span>
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
                        Tabi Grants Dashboard uses Google OAuth for authentication only.
                        We do not store or share your personal data with third parties.
                        We access your email and name to provide a personalized dashboard experience.
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
                <Link href="/" className="hover:text-signal transition-colors">
                    ← Back to Home
                </Link>
            </footer>
        </main>
    );
}
