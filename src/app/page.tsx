"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Activity, Cpu } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

import Features from "@/components/Features";
import Philosophy from "@/components/Philosophy";
import Protocol from "@/components/Protocol";
import Footer from "@/components/Footer";
import { TopoBackground } from "@/components/dashboard/TopoBackground";

// Abstract out GSAP registration to avoid SSR issues
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ============================================================================
// COMPONENTS
// ============================================================================

// --- Button ---
const MagnetButton = ({ children, className = "", onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) => {
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;

    const handleMouseEnter = () => {
      gsap.to(btn, { scale: 1.03, duration: 0.3, ease: "power2.out" });
    };
    const handleMouseLeave = () => {
      gsap.to(btn, { scale: 1, duration: 0.3, ease: "power2.out" });
    };

    btn.addEventListener("mouseenter", handleMouseEnter);
    btn.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      btn.removeEventListener("mouseenter", handleMouseEnter);
      btn.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <button
      ref={btnRef}
      onClick={onClick}
      className={`group relative overflow-hidden rounded-[2rem] px-8 py-4 font-heading font-medium transition-all ${className}`}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
      <span className="absolute inset-0 z-0 translate-y-[100%] bg-black transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:translate-y-0"></span>
    </button>
  );
};

// --- Navbar ---
const Navbar = () => {
  const navRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const { user, signInWithGoogle } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight * 0.5) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      ref={navRef}
      className={`fixed left-1/2 top-6 z-50 flex w-[90%] max-w-5xl -translate-x-1/2 items-center justify-between rounded-full px-6 py-4 transition-all duration-500 ${scrolled
        ? "border border-black/10 bg-offwhite/60 text-black backdrop-blur-xl"
        : "bg-transparent text-white"
        }`}
    >
      <div className="font-heading text-xl font-bold tracking-tight">Tabi Grants</div>
      <div className="hidden items-center gap-8 md:flex font-mono text-sm tracking-widest uppercase">
        <a href="#features" className="hover:-translate-y-px transition-transform">Features</a>
        <a href="#protocol" className="hover:-translate-y-px transition-transform">Protocol</a>
      </div>
      <div>
        {user ? (
          <button
            onClick={() => router.push('/dashboard')}
            className={`overflow-hidden rounded-full px-6 py-2.5 font-heading text-sm font-medium transition-colors ${scrolled ? 'bg-signal text-white hover:bg-black' : 'bg-white text-black hover:bg-signal hover:text-white'}`}
          >
            Dashboard
          </button>
        ) : (
          <button
            onClick={signInWithGoogle}
            className={`overflow-hidden rounded-full px-6 py-2.5 font-heading text-sm font-medium transition-colors ${scrolled ? 'bg-signal text-white hover:bg-black' : 'bg-white text-black hover:bg-signal hover:text-white'}`}
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

// --- Hero Section ---
const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { user, signInWithGoogle } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-elem", {
        y: 40,
        opacity: 0,
        duration: 1.2,
        stagger: 0.08,
        ease: "power3.out",
        delay: 0.2
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative flex h-[100dvh] w-full items-end p-8 pb-16 md:p-16 overflow-hidden">
      {/* Background Graphic */}
      <TopoBackground />

      <div className="relative z-10 max-w-4xl text-white">
        <div className="hero-elem mb-6 font-mono text-sm uppercase tracking-[0.2em] text-paper/70">
          Tabi Po Foundation — Grant Lifecycle System
        </div>
        <h1 className="hero-elem mb-2 font-heading text-5xl font-bold leading-tight tracking-tight md:text-7xl">
          Command the
        </h1>
        <h1 className="hero-elem mb-10 font-drama text-6xl italic leading-none tracking-tight text-paper md:text-[8rem]">
          Grant Lifecycle.
        </h1>

        {/* System Telemetry HUD */}
        <div className="hero-elem mb-12 flex flex-wrap gap-4 border-l-2 border-signal pl-6 font-mono text-[10px] uppercase tracking-[0.2em] text-paper/60">
          <div className="flex items-center gap-2 bg-signal/10 px-3 py-1.5 border border-signal/20 backdrop-blur-md">
            <div className="h-1.5 w-1.5 rounded-full bg-signal animate-pulse" />
            <span>SYS_ONLINE: 99.8%</span>
          </div>
          <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 border border-white/10 backdrop-blur-md">
            <Activity className="h-3 w-3 text-signal" />
            <span>TELEMETRY_SYNC: ACTIVE</span>
          </div>
          <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 border border-white/10 backdrop-blur-md">
            <Cpu className="h-3 w-3 text-signal" />
            <span>CONTEXT_MAPPING: STABLE</span>
          </div>
          <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 border border-white/10 backdrop-blur-md">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className={`h-3 w-1 ${i < 4 ? 'bg-signal' : 'bg-white/20'}`} />
              ))}
            </div>
            <span>SIGNAL_STRENGTH</span>
          </div>
        </div>

        <div className="hero-elem flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <MagnetButton
            onClick={user ? () => router.push('/dashboard') : signInWithGoogle}
            className="bg-signal text-white"
          >
            {user ? 'Go to Dashboard' : 'Access Dashboard'} <ArrowRight className="h-5 w-5" />
          </MagnetButton>
          <p className="max-w-xs font-mono text-xs text-paper/50">
            For use by authorized Foundation partners only. Secure enclave connection required.
          </p>
        </div>
      </div>
    </section>
  );
};

export default function Page() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  return (
    <main className="bg-offwhite selection:bg-signal selection:text-white">
      <Navbar />
      <Hero />
      <Features />
      <Philosophy />
      <Protocol />
      <Footer />
    </main>
  );
}
