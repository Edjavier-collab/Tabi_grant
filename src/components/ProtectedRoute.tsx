"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/");
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-offwhite">
                <div className="h-8 w-8 rounded-full border-4 border-signal border-t-transparent animate-spin"></div>
            </div>
        );
    }

    if (!user) {
        return null; // Will redirect in useEffect
    }

    return <>{children}</>;
}
