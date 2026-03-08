"use client";

import { useAuth } from "@/context/AuthContext";
import { LogOut, Calendar, LayoutDashboard, Settings, Map, FileText } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

interface Props {
    title: string;
    actionButton?: React.ReactNode;
}

export const DashboardHeader = ({ title, actionButton }: Props) => {
    const { user, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = async () => {
        await logout();
        router.push("/");
    };

    return (
        <header className="flex h-20 shrink-0 items-center justify-between border-b-4 border-black bg-offwhite px-8 w-full z-50 relative">
            <div className="flex items-center gap-6">
                <Link href="/dashboard" className="font-heading text-3xl font-black tracking-tighter uppercase hover:text-signal transition-colors">
                    Tabi Grants
                </Link>
                <div className="h-8 w-1 bg-black"></div>
                <div className="font-mono text-sm font-bold uppercase tracking-[0.2em] text-signal">
                    {title}
                </div>
            </div>

            <div className="flex items-center gap-6">
                {/* Navigation Links */}
                <nav className="flex items-center gap-4 hidden md:flex">
                    <Link
                        href="/dashboard"
                        className={`flex items-center gap-2 font-mono text-sm font-bold uppercase tracking-widest px-3 py-2 border-2 ${pathname === "/dashboard" ? "border-black bg-black text-white" : "border-transparent hover:border-black"}`}
                    >
                        <LayoutDashboard className="w-4 h-4" /> Pipeline
                    </Link>
                    <Link
                        href="/dashboard/calendar"
                        className={`flex items-center gap-2 font-mono text-sm font-bold uppercase tracking-widest px-3 py-2 border-2 ${pathname === "/dashboard/calendar" ? "border-black bg-black text-white" : "border-transparent hover:border-black"}`}
                    >
                        <Calendar className="w-4 h-4" /> Calendar
                    </Link>
                    <Link
                        href="/dashboard/field-data"
                        className={`flex items-center gap-2 font-mono text-sm font-bold uppercase tracking-widest px-3 py-2 border-2 ${pathname === "/dashboard/field-data" ? "border-black bg-black text-white" : "border-transparent hover:border-black"}`}
                    >
                        <Map className="w-4 h-4" /> Field Data
                    </Link>
                    <Link
                        href="/dashboard/reports"
                        className={`flex items-center gap-2 font-mono text-sm font-bold uppercase tracking-widest px-3 py-2 border-2 ${pathname === "/dashboard/reports" ? "border-black bg-black text-white" : "border-transparent hover:border-black"}`}
                    >
                        <FileText className="w-4 h-4" /> Reports
                    </Link>
                    <Link
                        href="/dashboard/settings"
                        className={`flex items-center gap-2 font-mono text-sm font-bold uppercase tracking-widest px-3 py-2 border-2 ${pathname === "/dashboard/settings" ? "border-black bg-black text-white" : "border-transparent hover:border-black"}`}
                    >
                        <Settings className="w-4 h-4" /> Settings
                    </Link>
                </nav>

                <div className="h-8 w-1 bg-black hidden md:block"></div>

                {actionButton}

                <div className="h-8 w-1 bg-black"></div>

                <div className="flex items-center gap-3">
                    {user?.photoURL ? (
                        <img src={user.photoURL} alt="Profile" className="h-10 w-10 border-2 border-black rounded-none shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]" />
                    ) : (
                        <div className="h-10 w-10 border-2 border-black bg-offwhite shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]"></div>
                    )}
                    <button
                        onClick={handleLogout}
                        className="flex h-10 w-10 items-center justify-center border-2 border-black bg-offwhite transition-all hover:bg-signal hover:text-white shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] hover:shadow-[1px_1px_0px_0px_rgba(17,17,17,1)] hover:translate-x-[1px] hover:translate-y-[1px]"
                        title="Logout"
                    >
                        <LogOut className="h-4 w-4 stroke-[3]" />
                    </button>
                </div>
            </div>
        </header>
    );
};
