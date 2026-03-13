import type { Metadata } from "next";
import { Space_Grotesk, DM_Serif_Display, Space_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });
const dmSerifDisplay = DM_Serif_Display({ weight: "400", subsets: ["latin"], style: ["normal", "italic"], variable: "--font-dm-serif" });
const spaceMono = Space_Mono({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-space-mono" });

export const metadata: Metadata = {
  title: "Tabi Grants | Command the Grant Lifecycle",
  description: "Zero loss grant tracking, context-aware draft engine, automatic evidence consolidation",
  verification: {
    google: "1B2f9GLLR6seXJMQGq1PsI1emiF9q-EDIXp_eeXtus4",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${dmSerifDisplay.variable} ${spaceMono.variable}`}>
      <body className="antialiased min-h-screen relative font-heading bg-offwhite text-black">
        {/* Global SVG Noise Filter */}
        <svg className="noise-overlay" xmlns="http://www.w3.org/2000/svg">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
