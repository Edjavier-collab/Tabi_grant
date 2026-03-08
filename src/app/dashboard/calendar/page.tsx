"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Grant } from "@/types/grant";
import { subscribeToGrants } from "@/lib/firebase/db";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { FollowupQueue } from "@/components/dashboard/FollowupQueue";
import { useFollowups } from "@/hooks/useFollowups";
import { ChevronLeft, ChevronRight, CalendarDays, ExternalLink } from "lucide-react";

const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface CalendarEvent {
    date: Date;
    label: string;
    type: "loi" | "proposal" | "fpic" | "general";
    grantId: string;
}

function getCalendarDays(year: number, month: number) {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: (number | null)[] = [];

    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);

    return days;
}

const eventColors: Record<string, { bg: string; text: string; border: string }> = {
    loi: { bg: "bg-signal/20", text: "text-signal", border: "border-signal" },
    proposal: { bg: "bg-amber-100", text: "text-amber-800", border: "border-amber-500" },
    fpic: { bg: "bg-emerald-100", text: "text-emerald-800", border: "border-emerald-500" },
    general: { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-400" },
};

export default function CalendarPage() {
    const [grants, setGrants] = useState<Grant[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const followups = useFollowups(grants);

    useEffect(() => {
        const unsubscribe = subscribeToGrants((data) => {
            setGrants(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // Extract events from grants
    const events: CalendarEvent[] = useMemo(() => {
        const ev: CalendarEvent[] = [];
        grants.forEach((g) => {
            if (g.loiDeadline) {
                ev.push({
                    date: new Date(g.loiDeadline),
                    label: `LOI: ${g.funderName}`,
                    type: "loi",
                    grantId: g.id,
                });
            }
            if (g.proposalDeadline) {
                ev.push({
                    date: new Date(g.proposalDeadline),
                    label: `Proposal: ${g.funderName}`,
                    type: "proposal",
                    grantId: g.id,
                });
            }
            if (g.fpicConsentDate) {
                ev.push({
                    date: new Date(g.fpicConsentDate),
                    label: `FPIC: ${g.funderName}`,
                    type: "fpic",
                    grantId: g.id,
                });
            }
        });
        return ev;
    }, [grants]);

    const calendarDays = getCalendarDays(currentYear, currentMonth);

    const getEventsForDay = (day: number) => {
        return events.filter((e) => {
            return (
                e.date.getFullYear() === currentYear &&
                e.date.getMonth() === currentMonth &&
                e.date.getDate() === day
            );
        });
    };

    const prevMonth = () => {
        if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); }
        else setCurrentMonth(currentMonth - 1);
    };

    const nextMonth = () => {
        if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); }
        else setCurrentMonth(currentMonth + 1);
    };

    const goToday = () => {
        setCurrentMonth(new Date().getMonth());
        setCurrentYear(new Date().getFullYear());
    };

    const today = new Date();
    const isToday = (day: number) =>
        day === today.getDate() &&
        currentMonth === today.getMonth() &&
        currentYear === today.getFullYear();

    // Generate GCal link for an event
    const getGCalLink = (event: CalendarEvent) => {
        const startDate = event.date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
        return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.label)}&dates=${startDate}/${startDate}`;
    };

    // Upcoming events (sorted, next 10)
    const upcomingEvents = useMemo(() => {
        const now = new Date();
        return events
            .filter((e) => e.date >= now)
            .sort((a, b) => a.date.getTime() - b.date.getTime())
            .slice(0, 10);
    }, [events]);

    return (
        <div className="flex flex-col h-screen bg-paper font-mono">
            <DashboardHeader title="Calendar Hub" />

            <main className="flex-1 overflow-auto p-8">
                {/* Follow-up Queue */}
                <FollowupQueue items={followups} />

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Calendar Grid */}
                    <div className="flex-1 space-y-4">
                        {/* Sync Toggle */}
                        <div className="flex items-center justify-between p-4 border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(17,17,17,1)]">
                            <div className="flex flex-col">
                                <span className="font-heading font-black text-lg uppercase tracking-widest text-[#FF3500]">Sync to Google Calendar</span>
                                <span className="font-mono text-xs text-black/60 font-bold uppercase">Automatically push new deadlines to GCal</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" />
                                <div className="w-14 h-7 bg-[#E2DFD8] peer-focus:outline-none border-2 border-black peer-checked:bg-signal peer-checked:after:translate-x-full peer-checked:after:border-black after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-2 after:border-black after:h-5 after:w-6 after:transition-all shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]"></div>
                            </label>
                        </div>

                        <div className="border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] overflow-hidden">
                            {/* Calendar Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b-4 border-black bg-black text-white">
                                <button onClick={prevMonth} className="p-2 hover:bg-signal transition-colors">
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <div className="flex items-center gap-4">
                                    <h2 className="font-heading font-black text-xl uppercase tracking-widest">
                                        {MONTH_NAMES[currentMonth]} {currentYear}
                                    </h2>
                                    <button
                                        onClick={goToday}
                                        className="font-mono text-xs bg-signal px-3 py-1 font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
                                    >
                                        Today
                                    </button>
                                </div>
                                <button onClick={nextMonth} className="p-2 hover:bg-signal transition-colors">
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Day Labels */}
                            <div className="grid grid-cols-7 border-b-2 border-black">
                                {DAY_LABELS.map((label) => (
                                    <div key={label} className="py-2 text-center font-mono text-xs font-black uppercase tracking-widest text-black/50 border-r last:border-r-0 border-black/10">
                                        {label}
                                    </div>
                                ))}
                            </div>

                            {/* Calendar Days */}
                            <div className="grid grid-cols-7">
                                {calendarDays.map((day, idx) => {
                                    const dayEvents = day ? getEventsForDay(day) : [];
                                    return (
                                        <div
                                            key={idx}
                                            className={`min-h-[100px] p-2 border-r border-b border-black/10 transition-colors ${day ? "bg-white hover:bg-offwhite" : "bg-offwhite/50"
                                                } ${isToday(day!) ? "ring-4 ring-inset ring-signal" : ""}`}
                                        >
                                            {day && (
                                                <>
                                                    <span className={`font-mono text-sm font-bold ${isToday(day) ? "bg-signal text-white px-1.5 py-0.5" : "text-black/70"}`}>
                                                        {day}
                                                    </span>
                                                    <div className="mt-1 space-y-1">
                                                        {dayEvents.map((ev, eidx) => {
                                                            const colors = eventColors[ev.type];
                                                            return (
                                                                <a
                                                                    key={eidx}
                                                                    href={getGCalLink(ev)}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className={`block px-1.5 py-0.5 text-[10px] font-mono font-bold truncate border-l-2 ${colors.bg} ${colors.text} ${colors.border} hover:brightness-90 transition-all`}
                                                                    title={`${ev.label} — Click to add to Google Calendar`}
                                                                >
                                                                    {ev.label}
                                                                </a>
                                                            );
                                                        })}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar: Upcoming Deadlines */}
                    <div className="w-full lg:w-[360px] shrink-0 border-4 border-black bg-white shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] overflow-hidden self-start">
                        <div className="px-6 py-4 border-b-4 border-black bg-black text-white">
                            <h3 className="font-heading font-black text-base uppercase tracking-widest flex items-center gap-2">
                                <CalendarDays className="w-5 h-5" /> Upcoming Deadlines
                            </h3>
                        </div>

                        <div className="divide-y divide-black/10 max-h-[500px] overflow-y-auto">
                            {upcomingEvents.length === 0 ? (
                                <div className="p-6 text-center font-mono text-sm text-black/40">
                                    No upcoming deadlines found.
                                </div>
                            ) : (
                                upcomingEvents.map((ev, idx) => {
                                    const colors = eventColors[ev.type];
                                    const dateStr = ev.date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                                    return (
                                        <div key={idx} className="flex items-center gap-4 px-6 py-3 hover:bg-offwhite transition-colors group">
                                            <div className={`text-center min-w-[50px] py-1 px-2 border-2 border-black font-mono text-xs font-black ${colors.bg}`}>
                                                {dateStr}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`font-mono text-sm font-bold truncate ${colors.text}`}>
                                                    {ev.label}
                                                </p>
                                            </div>
                                            <a
                                                href={getGCalLink(ev)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-signal"
                                                title="Add to Google Calendar"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
