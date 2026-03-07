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
        <div className="relative flex h-64 w-full flex-col items-center justify-center bg-paper p-6 overflow-hidden rounded-[2rem] border border-black/10 shadow-sm">
            <div className="absolute top-6 left-6 flex items-center gap-2">
                <Activity className="h-4 w-4 text-signal" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-black">Zero Loss Tracking</span>
            </div>

            <div className="relative h-32 w-full max-w-[200px]" ref={containerRef}>
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
        <div ref={containerRef} className="relative flex h-64 w-full flex-col justify-between bg-black p-6 rounded-[2rem] text-offwhite border border-signal/20 shadow-sm">
            <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-signal animate-pulse" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-signal">Context-Aware Draft Engine</span>
            </div>

            <div className="font-mono text-sm leading-relaxed text-paper/90">
                <span className="text-signal mr-2">{">"}</span>
                {displayedText}
                <span className="inline-block w-2 h-4 ml-1 bg-signal animate-pulse" />
            </div>

            <div className="flex items-center justify-between font-mono text-[10px] text-paper/40">
                <span>SESSION: 492X</span>
                <span>SYS.ONLINE</span>
            </div>
        </div>
    );
};

const CursorProtocolScheduler = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    // A crude simulation of a cursor moving to a grid day
    return (
        <div className="relative flex h-64 w-full flex-col bg-paper p-6 rounded-[2rem] border border-black/10 shadow-sm overflow-hidden" ref={containerRef}>
            <div className="mb-4 flex items-center gap-2">
                <Cpu className="h-4 w-4 text-signal" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-black">Automatic Evidence</span>
            </div>

            <div className="flex-1 flex flex-col justify-center">
                <div className="grid grid-cols-7 gap-1">
                    {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                        <div key={i} className="text-center font-mono text-[10px] font-bold text-black/50">{day}</div>
                    ))}
                    {Array.from({ length: 7 }).map((_, i) => (
                        <div
                            key={i}
                            className={`h-8 w-full rounded relative border border-black/5 ${i === 3 ? "bg-signal/10 transition-colors duration-1000" : "bg-offwhite"}`}
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

            <div className="flex justify-between items-end">
                <div className="font-heading text-xs text-black/70 max-w-[120px]">
                    KoBo Sync, Drive Linked, Impact Mapped.
                </div>
                <div className="flex h-8 items-center justify-center rounded-full bg-black px-4 font-mono text-xs text-paper transition-transform hover:scale-105 cursor-pointer">
                    Save Evidence
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
                <p className="mt-4 font-mono text-sm text-black/60 max-w-xl">
                    Zero-loss operations. We do not drop data. We integrate, process, and consolidate automatically.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
