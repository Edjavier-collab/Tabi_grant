"use client";

import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Grant, Stage, STAGES } from "@/types/grant";
import { updateGrantStage } from "@/lib/firebase/db";
import { GrantCard } from "./GrantCard";
import { FpicModal } from "./FpicModal";
import { LoiGenerator } from "@/components/documents/LoiGenerator";
import { AnalyticsWidgets } from "./AnalyticsWidgets";
import { Search, X } from "lucide-react";

interface KanbanBoardProps {
    initialGrants: Grant[];
}

export const KanbanBoard = ({ initialGrants }: KanbanBoardProps) => {
    const [grants, setGrants] = useState<Grant[]>(initialGrants);
    const [showArchived, setShowArchived] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // FPIC Modal State
    const [fpicGrant, setFpicGrant] = useState<Grant | null>(null);
    const [isFpicModalOpen, setIsFpicModalOpen] = useState(false);
    const [loiGrant, setLoiGrant] = useState<Grant | null>(null);
    const [isLoiOpen, setIsLoiOpen] = useState(false);

    useEffect(() => {
        setGrants(initialGrants);
    }, [initialGrants]);

    const onDragEnd = async (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const newStage = destination.droppableId as Stage;
        const grant = grants.find((g) => g.id === draggableId);

        if (!grant) return;

        // FPIC COMPLIANCE INTERCEPTOR
        if (newStage === "Active Grant" && !grant.fpicConsentDate) {
            setFpicGrant(grant);
            setIsFpicModalOpen(true);
            return; // Halt the drag-and-drop process here
        }

        // Optimistic UI update for normal moves
        const updatedGrants = grants.map((g) => {
            if (g.id === draggableId) {
                return { ...g, currentStage: newStage };
            }
            return g;
        });
        setGrants(updatedGrants);

        try {
            await updateGrantStage(draggableId, newStage);
        } catch (error) {
            console.error("Failed to update grant stage", error);
        }
    };

    const handleFpicSuccess = (grantId: string, fpicDate: string, fpicUrl: string) => {
        // Optimistic UI update upon FPIC success
        const updatedGrants = grants.map((g) => {
            if (g.id === grantId) {
                return {
                    ...g,
                    currentStage: "Active Grant" as Stage,
                    fpicConsentDate: fpicDate,
                    fpicDocumentUrl: fpicUrl
                };
            }
            return g;
        });
        setGrants(updatedGrants);
    };

    // FILTER GRANTS BASED ON STATUS AND SEARCH
    const filteredGrants = grants.filter((g) => {
        if (g.status === "deleted") return false;

        const searchMatches = 
            g.funderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            g.projectLinked.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (g.programName?.toLowerCase().includes(searchQuery.toLowerCase()) || false);

        if (!searchMatches) return false;

        if (showArchived) return g.status === "archived";
        return !g.status || g.status === "active";
    });

    // ANALYTICS SHOULD ALWAYS REFLECT ACTIVE PIPELINE
    const activeGrantsForAnalytics = grants.filter(g =>
        (!g.status || g.status === "active") && STAGES.includes(g.currentStage)
    );

    return (
        <>
            <div className="flex flex-col gap-6 mb-8">
                <AnalyticsWidgets grants={activeGrantsForAnalytics} />
                
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                    {/* Search Bar */}
                    <div className="relative flex-1 max-w-2xl group">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-black/40 group-focus-within:text-signal transition-colors">
                            <Search className="w-5 h-5 stroke-[3]" />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="SEARCH BY FUNDER OR PROJECT..."
                            className="w-full pl-12 pr-12 py-4 bg-white border-4 border-black font-mono text-sm font-black uppercase tracking-widest focus:outline-none focus:ring-0 focus:shadow-[6px_6px_0px_0px_rgba(230,59,46,1)] hover:shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] transition-all placeholder:text-black/20"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute inset-y-0 right-4 flex items-center text-black/40 hover:text-signal transition-colors"
                            >
                                <X className="w-5 h-5 stroke-[3]" />
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setShowArchived(!showArchived)}
                            className={`px-6 py-4 font-mono text-xs font-black uppercase tracking-widest border-4 border-black transition-all shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] active:shadow-none active:translate-x-1 active:translate-y-1 ${showArchived ? "bg-signal text-white" : "bg-white text-black hover:bg-offwhite"
                                }`}
                        >
                            {showArchived ? "Viewing Archived" : "View Archive"}
                        </button>
                    </div>
                </div>
            </div>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex min-h-[400px] max-h-[calc(100vh-400px)] w-full gap-4 md:gap-6 overflow-x-auto pb-6 pr-4 md:pr-8 snap-x scrollbar-brutalist">
                    {STAGES.map((stage) => {
                        const columnGrants = filteredGrants.filter((g) => g.currentStage === stage);

                        return (
                            <div
                                key={stage}
                                className="flex w-[340px] shrink-0 snap-start flex-col gap-0 border-2 border-black bg-offwhite shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] overflow-hidden"
                            >
                                <div className="flex items-center justify-between px-4 py-3 border-b-2 border-black bg-black text-white">
                                    <h3 className="font-heading font-black text-sm uppercase tracking-widest">
                                        {stage}
                                    </h3>
                                    <div className="flex items-center justify-center bg-signal text-white border-2 border-black h-6 min-w-6 px-1.5 text-xs font-mono font-black shadow-[2px_2px_0px_0px_rgba(255,255,255,0.3)]">
                                        {columnGrants.length}
                                    </div>
                                </div>

                                <Droppable droppableId={stage}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            className={`flex flex-1 flex-col gap-4 p-4 transition-colors min-h-[200px] overflow-y-auto ${snapshot.isDraggingOver ? "bg-signal/10" : "bg-transparent"
                                                }`}
                                        >
                                            {columnGrants.map((grant, index) => (
                                                <Draggable key={grant.id} draggableId={grant.id} index={index}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className={`transition-shadow ${snapshot.isDragging ? "z-50 scale-[1.02] rotate-1" : ""}`}
                                                            style={{ ...provided.draggableProps.style }}
                                                        >
                                                            <GrantCard grant={grant} onGenerateLoi={(g) => { setLoiGrant(g); setIsLoiOpen(true); }} />
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        );
                    })}
                </div>
                <FpicModal
                    grant={fpicGrant}
                    isOpen={isFpicModalOpen}
                    onClose={() => setIsFpicModalOpen(false)}
                    onSuccess={handleFpicSuccess}
                />
            </DragDropContext>
            <LoiGenerator
                grant={loiGrant}
                isOpen={isLoiOpen}
                onClose={() => setIsLoiOpen(false)}
            />
        </>
    );
};
