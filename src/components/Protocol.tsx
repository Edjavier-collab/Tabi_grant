"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const steps = [
    {
        num: "01",
        title: "Intelligence Gathering",
        desc: "AI-powered parsing of donor RFPs and automated context mapping for high-probability alignment."
    },
    {
        num: "02",
        title: "Telemetry Consolidation",
        desc: "Centralized evidence locker automatically pulling field data and linking to reporting checkpoints."
    },
    {
        num: "03",
        title: "Lifecycle Command",
        desc: "Zero-loss progression from Prospect to Active Grant with mandatory compliance gates and alerts."
    }
];

export default function Protocol() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const cards = gsap.utils.toArray(".protocol-card") as HTMLElement[];

            cards.forEach((card, i) => {
                if (i === 0) return; // Skip first card

                ScrollTrigger.create({
                    trigger: card,
                    start: `top top+=${100 + i * 20}`, // Stagger the sticky positioning visual
                    endTrigger: containerRef.current,
                    end: "bottom bottom",
                    pin: true,
                    pinSpacing: false,
                    animation: gsap.to(cards[i - 1], {
                        scale: 0.9,
                        opacity: 0.5,
                        filter: "blur(10px)",
                        ease: "none"
                    }),
                    scrub: true,
                });
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section id="protocol" ref={containerRef} className="bg-offwhite py-24 px-6 md:px-16 min-h-[300vh] relative">
            <div className="max-w-4xl mx-auto space-y-4 font-mono text-sm tracking-widest text-black/60 uppercase mb-24 sticky top-12 z-50 mix-blend-difference">
                Protocol System
            </div>

            <div className="max-w-4xl mx-auto space-y-32">
                {steps.map((step, idx) => (
                    <div
                        key={idx}
                        className="protocol-card min-h-[60vh] md:min-h-[70vh] bg-paper rounded-[3rem] p-10 md:p-20 shadow-2xl border border-black/10 flex flex-col justify-between"
                    >
                        <div className="font-mono text-4xl font-bold text-signal">{step.num}</div>

                        <div className="space-y-6">
                            <h2 className="font-heading text-4xl md:text-6xl font-bold tracking-tight text-black max-w-2xl leading-tight">
                                {step.title}
                            </h2>
                            <p className="font-drama text-2xl md:text-4xl text-black/70 italic max-w-xl">
                                {step.desc}
                            </p>
                        </div>

                        {/* Geometric Motif */}
                        <div className="absolute right-10 bottom-10 md:right-20 md:bottom-20 opacity-20 pointer-events-none">
                            <svg width="200" height="200" viewBox="0 0 100 100" className={idx % 2 === 0 ? "animate-spin-slow" : "animate-bounce-slow"}>
                                <rect x="25" y="25" fill="none" stroke="currentColor" strokeWidth="2" width="50" height="50" />
                                <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="1" />
                                <line x1="50" y1="0" x2="50" y2="100" stroke="currentColor" strokeWidth="1" />
                                <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeWidth="1" />
                            </svg>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
