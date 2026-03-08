"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export const TopoBackground = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !svgRef.current) return;

    const paths = svgRef.current.querySelectorAll("path");
    
    paths.forEach((path, i) => {
      // Use a fixed large number if getTotalLength is unavailable or for simplicity
      const length = path.getTotalLength() || 2000;
      
      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
        opacity: 0,
      });

      // Staggered reveal
      gsap.to(path, {
        strokeDashoffset: 0,
        opacity: i % 5 === 0 ? 0.6 : 0.2, // Make red lines (every 5th) more prominent
        duration: 2 + Math.random() * 3,
        delay: Math.random() * 1.5,
        ease: "power2.out",
      });

      // Flowing movement
      gsap.to(path, {
        strokeDashoffset: length * 0.1,
        duration: 15 + Math.random() * 20,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });

    // Mouse parallax
    const handleMouseMove = (e: MouseEvent) => {
      if (!svgRef.current) return;
      const { clientX, clientY } = e;
      const xPos = (clientX / window.innerWidth - 0.5) * 40;
      const yPos = (clientY / window.innerHeight - 0.5) * 40;

      gsap.to(svgRef.current, {
        x: xPos,
        y: yPos,
        duration: 1.5,
        ease: "power2.out",
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mounted]);

  // Generate paths once to avoid re-renders changing the "terrain"
  const [staticPaths] = useState(() => {
    return Array.from({ length: 45 }).map((_, i) => {
      const isRed = i % 5 === 0;
      const startX = Math.random() * 1200 - 100;
      const startY = Math.random() * 1200 - 100;
      const cp1x = startX + (Math.random() - 0.5) * 600;
      const cp1y = startY + (Math.random() - 0.5) * 600;
      const cp2x = cp1x + (Math.random() - 0.5) * 600;
      const cp2y = cp1y + (Math.random() - 0.5) * 600;
      const endX = cp2x + (Math.random() - 0.5) * 600;
      const endY = cp2y + (Math.random() - 0.5) * 600;
      return {
        d: `M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`,
        isRed
      };
    });
  });

  if (!mounted) return <div className="absolute inset-0 bg-black" />;

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-black">
      <svg
        ref={svgRef}
        viewBox="0 0 1000 1000"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full scale-110 opacity-80"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="glow-red">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        {staticPaths.map((path, i) => (
          <path
            key={i}
            d={path.d}
            fill="none"
            stroke={path.isRed ? "#E63B2E" : "#FFFFFF"}
            strokeWidth={path.isRed ? 2 : 0.5}
            filter={path.isRed ? "url(#glow-red)" : ""}
            className="pointer-events-none"
          />
        ))}

        {/* River-like deep roots */}
        {Array.from({ length: 15 }).map((_, i) => (
          <path
            key={`river-${i}`}
            d={`M ${200 + i * 50} 0 Q ${500 + (Math.random()-0.5)*200} 500, ${300 + i * 40} 1000`}
            fill="none"
            stroke="#E63B2E"
            strokeWidth="0.8"
            opacity="0.1"
            className="animate-pulse"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </svg>
      
      {/* Visual Overlays */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,black_80%)]"></div>
    </div>
  );
};
