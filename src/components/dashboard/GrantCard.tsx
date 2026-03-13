import { Grant } from "@/types/grant";
import { Clock, DollarSign, AlertCircle, FileText, Archive, RotateCcw, Trash2 } from "lucide-react";
import { archiveGrant, restoreGrant, deleteGrant } from "@/lib/firebase/db";

interface Props {
    grant: Grant;
    onGenerateLoi?: (grant: Grant) => void;
}

export const GrantCard = ({ grant, onGenerateLoi }: Props) => {
    // Format amount safely
    const formattedAmount = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0
    }).format(grant.amountRequested);

    // Helper for priority deadlines (e.g. less than 14 days away)
    const isUrgent = () => {
        if (!grant.loiDeadline && !grant.proposalDeadline) return false;

        const dateStr = grant.loiDeadline || grant.proposalDeadline;
        if (!dateStr) return false;

        const diffTime = Math.abs(new Date(dateStr).getTime() - new Date().getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 30; 
    };

    const isFPICMissing = grant.currentStage === "Awarded" && !grant.fpicConsentDate;
    const isArchived = grant.status === "archived";

    const handleArchive = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm("Are you sure you want to archive this grant?")) {
            await archiveGrant(grant.id);
        }
    };

    const handleRestore = async (e: React.MouseEvent) => {
        e.stopPropagation();
        await restoreGrant(grant.id);
    };

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm("Are you sure you want to delete this grant? This is a soft-delete.")) {
            await deleteGrant(grant.id);
        }
    };

    return (
        <div className={`group relative w-full flex flex-col gap-0 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] hover:shadow-[6px_6px_0px_0px_rgba(230,59,46,1)] hover:-translate-y-1 hover:-translate-x-1 transition-all cursor-grab active:cursor-grabbing ${isArchived ? "opacity-75 grayscale-[0.5]" : ""}`}>
            {/* Top row: Funder & Priority Tag */}
            <div className="flex items-start justify-between gap-2 p-3 pb-2 border-b-2 border-black bg-paper">
                <div className="flex flex-col">
                    <h3 className="font-heading font-black text-black leading-tight text-lg uppercase tracking-tight">
                        {grant.funderName}
                    </h3>
                    {isArchived && (
                        <span className="text-[9px] font-mono font-bold text-signal uppercase tracking-widest mt-1">
                            [ Archived ]
                        </span>
                    )}
                </div>
                <div className="flex gap-1">
                    {isUrgent() && !isArchived && (
                        <span className="flex-shrink-0 bg-signal text-white px-2 py-1 text-[10px] font-mono font-black uppercase tracking-widest border border-black shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] transform rotate-2">
                            Urgent
                        </span>
                    )}
                    {/* Inline Actions */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {isArchived ? (
                            <button onClick={handleRestore} className="p-1 hover:text-signal transition-colors" title="Restore">
                                <RotateCcw className="w-4 h-4" />
                            </button>
                        ) : (
                            <button onClick={handleArchive} className="p-1 hover:text-signal transition-colors" title="Archive">
                                <Archive className="w-4 h-4" />
                            </button>
                        )}
                        <button onClick={handleDelete} className="p-1 hover:text-signal transition-colors" title="Delete">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Middle row: Program & Linked Project */}
            <div className="p-3 bg-white">
                {(grant.programName || grant.projectLinked) && (
                    <div className="text-xs font-mono font-bold text-black uppercase tracking-wider line-clamp-2 mb-3 leading-relaxed">
                        &rsaquo; {grant.projectLinked} {grant.programName ? `// ${grant.programName}` : ""}
                    </div>
                )}

                {/* Bottom info section */}
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono font-bold uppercase text-black">
                    <div className="flex items-center gap-2 border-2 border-black bg-offwhite p-2">
                        <DollarSign className="w-3.5 h-3.5 text-signal stroke-[3]" />
                        <span className="truncate">{formattedAmount}</span>
                    </div>

                    <div className="flex items-center gap-2 border-2 border-black bg-offwhite p-2">
                        <Clock className="w-3.5 h-3.5 text-black stroke-[3]" />
                        <span className="truncate">
                            {grant.loiDeadline ? new Date(grant.loiDeadline).toLocaleDateString() : "TBD"}
                        </span>
                    </div>
                </div>

                {/* Quick Actions */}
                {onGenerateLoi && !isArchived && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onGenerateLoi(grant); }}
                        className="mt-3 w-full flex items-center justify-center gap-2 py-2 bg-black text-white font-mono text-[10px] font-bold uppercase tracking-widest hover:bg-signal transition-colors opacity-0 group-hover:opacity-100"
                    >
                        <FileText className="w-3 h-3" /> Generate LOI
                    </button>
                )}
            </div>

            {/* Constraints Warnings */}
            {isFPICMissing && !isArchived && (
                <div className="bg-black text-signal p-2 border-t-2 border-black text-xs font-mono font-bold uppercase tracking-widest flex items-center justify-center gap-2 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(230,59,46,1) 5px, rgba(230,59,46,1) 10px)' }}></div>
                    <AlertCircle className="w-4 h-4 z-10 stroke-[3]" />
                    <span className="z-10">FPIC Block</span>
                </div>
            )}
        </div>
    );
};
