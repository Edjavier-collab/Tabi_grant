import React from "react";
import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-paper font-mono">
            <h2 className="text-4xl font-heading font-black">404 - Not Found</h2>
            <p className="mt-4 text-black/50">Could not find requested resource</p>
            <Link href="/" className="mt-8 px-6 py-3 bg-black text-white hover:bg-signal transition-colors font-bold uppercase tracking-widest text-sm">
                Return Home
            </Link>
        </div>
    );
}
