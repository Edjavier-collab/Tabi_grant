"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CheckCircle2, Activity, Cpu } from "lucide-react";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

// ============================================================================
// FEATURE CARDS
// ============================================================================

const Sparkline = ({ color = "text-signal" }: { color?: string }) => (
    <div className={`flex items-end gap-0.5 h-6 ${color}`}>
        {[0.4, 0.7, 0.5, 0.9, 0.6, 0.8, 1, 0.7, 0.9, 0.5, 0.8].map((val, i) => (
            <div
                key={i}
                className="w-1 bg-current"
                style={{ height: `${val * 100}%` }}
            />
        ))}
    </div>
);

const DiagnosticShuffler = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [cards, setCards] = useState([
        { id: 1, title: "Pipeline Integrity", offset: 0 },
        { id: 2, title: "Deadline Alerts", offset: 1 },
        { id: 3, title: "Status Sync", offset: 2 }
    ]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCards(prev => {
                const newCards = [...prev];
                const last = newCards.pop()!;
                newCards.unshift(last);
                return newCards.map((c, i) => ({ ...c, offset: i }));
            });
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative flex h-80 w-full flex-col items-center justify-center bg-paper p-6 overflow-hidden rounded-[2rem] border border-black/10 shadow-sm">
            <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-signal" />
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-black">Zero Loss Tracking</span>
                </div>
                <div className="bg-signal/10 px-2 py-0.5 border border-signal/20 rounded font-mono text-[8px] font-black text-signal uppercase">
                    [MAPPED: 100%]
                </div>
            </div>

            <div className="relative h-32 w-full max-w-[200px] mb-4" ref={containerRef}>
                {cards.map((card) => (
                    <div
                        key={card.id}
                        className="absolute left-0 right-0 top-0 flex items-center justify-between rounded-xl border border-black/10 bg-offwhite p-4 shadow-sm transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                        style={{
                            transform: `translateY(${card.offset * 12}px) scale(${1 - card.offset * 0.05})`,
                            opacity: 1 - card.offset * 0.3,
                            zIndex: 10 - card.offset,
                        }}
                    >
                        <span className="font-heading text-sm font-semibold text-black">{card.title}</span>
                        <CheckCircle2 className="h-4 w-4 text-signal" />
                    </div>
                ))}
            </div>

            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                <div className="flex flex-col">
                    <span className="font-mono text-[8px] text-black/40 uppercase mb-1">Integrity Flux</span>
                    <Sparkline />
                </div>
                <div className="font-mono text-[10px] text-black/60 font-black">
                    CONFIDENCE: <span className="text-signal">99.2%</span>
                </div>
            </div>
        </div>
    );
};

const TelemetryTypewriter = () => {
    const text = "Generating LOI for Moore Foundation. Selected persona: Scientific. Glossary appended: YES. Confidence: 99.4%";
    const [displayedText, setDisplayedText] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            ScrollTrigger.create({
                trigger: containerRef.current,
                start: "top 80%",
                onEnter: () => setIsTyping(true),
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    useEffect(() => {
        if (!isTyping) return;

        let index = 0;
        const interval = setInterval(() => {
            setDisplayedText(text.substring(0, index));
            index++;
            if (index > text.length) clearInterval(interval);
        }, 40);
        return () => clearInterval(interval);
    }, [isTyping]);

    return (
        <div ref={containerRef} className="relative flex h-80 w-full flex-col justify-between bg-black p-6 rounded-[2rem] text-offwhite border border-signal/20 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-signal animate-pulse" />
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-signal">Context-Aware Draft Engine</span>
                </div>
                <span className="font-mono text-[9px] text-white/40 border border-white/20 px-1.5 py-0.5">V4.0_STABLE</span>
            </div>

            <div className="font-mono text-sm leading-relaxed text-paper/90 relative z-10 py-4">
                <span className="text-signal mr-2">{">"}</span>
                {displayedText}
                <span className="inline-block w-2 h-4 ml-1 bg-signal animate-pulse" />
            </div>

            <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-auto">
                <div className="flex flex-col">
                    <span className="font-mono text-[8px] text-paper/40 uppercase mb-1">LLM Latency</span>
                    <Sparkline color="text-white/60" />
                </div>
                <div className="flex flex-col items-end">
                    <div className="font-mono text-[10px] text-paper/40 flex gap-4 mb-2">
                        <span>SESSION: 492X</span>
                        <span>SYS.ONLINE</span>
                    </div>
                    <div className="bg-signal text-black px-2 py-0.5 font-mono text-[10px] font-black uppercase">
                        CONFIDENCE: 99.4%
                    </div>
                </div>
            </div>
            
            {/* Background scanner line effect */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-signal/20 animate-scan pointer-events-none" />
        </div>
    );
};

const CursorProtocolScheduler = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <div className="relative flex h-80 w-full flex-col bg-paper p-6 rounded-[2rem] border border-black/10 shadow-sm overflow-hidden" ref={containerRef}>
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-signal" />
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-black">Automatic Evidence</span>
                </div>
                <div className="flex items-center gap-1">
                    <span className="font-mono text-[8px] text-black/40 uppercase">SYNC_STATUS:</span>
                    <span className="font-mono text-[8px] font-black text-signal uppercase">VERIFIED</span>
                </div>
            </div>

            <div className="flex-1 flex flex-col justify-center mb-4">
                <div className="grid grid-cols-7 gap-1">
                    {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                        <div key={i} className="text-center font-mono text-[10px] font-bold text-black/50">{day}</div>
                    ))}
                    {Array.from({ length: 7 }).map((_, i) => (
                        <div
                            key={i}
                            className={`h-10 w-full rounded relative border border-black/5 ${i === 3 ? "bg-signal/10 transition-colors duration-1000" : "bg-offwhite"}`}
                        >
                            {i === 3 && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="h-2 w-2 rounded-full bg-signal animate-ping" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-between items-end border-t border-black/5 pt-4">
                <div className="flex flex-col">
                    <span className="font-mono text-[8px] text-black/40 uppercase mb-1">Evidence Velocity</span>
                    <Sparkline />
                </div>
                <div className="flex flex-col items-end gap-2">
                    <div className="font-heading text-[10px] text-black/70 max-w-[120px] text-right font-black uppercase tracking-tighter">
                        KoBo Sync, Drive Linked, Impact Mapped.
                    </div>
                    <div className="flex h-8 items-center justify-center rounded-full bg-black px-4 font-mono text-[10px] font-black uppercase text-paper transition-all hover:bg-signal hover:text-black cursor-pointer shadow-[2px_2px_0px_0px_rgba(230,59,46,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]">
                        Save Evidence
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function Features() {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".feature-card", {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 75%",
                },
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: "power3.out"
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section id="features" ref={sectionRef} className="py-24 px-6 md:px-16 max-w-7xl mx-auto">
            <div className="mb-16">
                <h2 className="font-heading text-4xl font-bold tracking-tight text-black md:text-5xl">Interactive Functional Artifacts</h2>
                <p className="mt-4 font-mono text-sm text-black/60 max-w-2xl leading-relaxed">
                    Zero-loss operations. Tabi Grants leverages <span className="text-black font-black">playwright-cli</span> for autonomous data verification, 
                    <span className="text-black font-black"> frontend-design</span> for high-fidelity brutalist interfaces, and <span className="text-black font-black">skill-creator</span> 
                    to evolve custom intelligence protocols. We integrate, process, and consolidate automatically.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="feature-card">
                    <DiagnosticShuffler />
                </div>
                <div className="feature-card">
                    <TelemetryTypewriter />
                </div>
                <div className="feature-card">
                    <CursorProtocolScheduler />
                </div>
            </div>
        </section>
    );
}
