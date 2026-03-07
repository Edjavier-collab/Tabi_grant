"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function Philosophy() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Split text logic simulated with spans
            gsap.from(".split-line", {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 60%",
                },
                y: 60,
                opacity: 0,
                stagger: 0.1,
                duration: 1,
                ease: "power4.out"
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="relative flex flex-col items-center justify-center bg-black py-40 px-6 text-center text-paper overflow-hidden">
            {/* Parallax texture */}
            <div
                className="absolute inset-0 z-0 opacity-10 mix-blend-overlay"
                style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1549740425-5e9ed4d8cd34?q=80&w=2940&auto=format&fit=crop')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundAttachment: "fixed"
                }}
            />

            <div className="relative z-10 max-w-5xl mx-auto space-y-16">
                <div>
                    <p className="split-line font-mono text-sm tracking-widest text-paper/60 uppercase mb-4">The Manifesto</p>
                    <div className="flex flex-col gap-2">
                        <h3 className="split-line font-heading text-xl md:text-3xl text-paper/80 font-medium tracking-tight">
                            Most philanthropy focuses on: administrative overhead.
                        </h3>
                        <h2 className="split-line font-drama text-5xl md:text-8xl italic leading-none tracking-tight text-paper mt-6">
                            We focus on: <span className="text-signal not-italic font-heading">Impact</span>.
                        </h2>
                    </div>
                </div>
            </div>
        </section>
    );
}
