"use client";

import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Grant, Stage, STAGES } from "@/types/grant";
import { subscribeToGrants, updateGrantStage } from "@/lib/firebase/db";
import { GrantCard } from "./GrantCard";
import { FpicModal } from "./FpicModal";
import { FollowupQueue } from "./FollowupQueue";
import { useFollowups } from "@/hooks/useFollowups";
import { LoiGenerator } from "@/components/documents/LoiGenerator";
import { AnalyticsWidgets } from "./AnalyticsWidgets";

export const KanbanBoard = () => {
    const [grants, setGrants] = useState<Grant[]>([]);
    const [loading, setLoading] = useState(true);

    // FPIC Modal State
    const [fpicGrant, setFpicGrant] = useState<Grant | null>(null);
    const [isFpicModalOpen, setIsFpicModalOpen] = useState(false);
    const [loiGrant, setLoiGrant] = useState<Grant | null>(null);
    const [isLoiOpen, setIsLoiOpen] = useState(false);
    const followups = useFollowups(grants);

    useEffect(() => {
        const unsubscribe = subscribeToGrants((data) => {
            setGrants(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

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

    return (
        <>
            <AnalyticsWidgets grants={grants} />
            <FollowupQueue items={followups} />
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex min-h-[400px] max-h-[calc(100vh-400px)] w-full gap-4 md:gap-6 overflow-x-auto pb-6 pr-4 md:pr-8 snap-x scrollbar-brutalist">
                    {STAGES.map((stage) => {
                        const columnGrants = grants.filter((g) => g.currentStage === stage);

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
