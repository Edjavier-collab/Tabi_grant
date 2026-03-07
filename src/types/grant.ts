export type Stage =
    | "Prospect"
    | "LOI Draft"
    | "LOI Submitted"
    | "Invited to Apply"
    | "Proposal Submitted"
    | "Awarded"
    | "Declined"
    | "Active Grant"
    | "Closed";

export const STAGES: Stage[] = [
    "Prospect",
    "LOI Draft",
    "LOI Submitted",
    "Invited to Apply",
    "Proposal Submitted",
    "Awarded",
    "Declined",
    "Active Grant",
    "Closed"
];

export interface GrantDocument {
    url: string;
    name: string;
    tag: "LOI" | "Proposal" | "Budget" | "Report" | "FPIC" | "Other";
    addedAt: string; // ISO date string
}

export interface Grant {
    id: string; // Firestore document ID
    funderName: string;
    programName?: string;
    amountRequested: number;
    projectLinked: string;
    primaryContact?: {
        name: string;
        email: string;
        phone?: string;
    };
    currentStage: Stage;
    loiDeadline?: string | null; // ISO date string
    proposalDeadline?: string; // ISO date string
    decisionExpectedDate?: string; // ISO date string
    lastContactDate?: string; // ISO date string
    notes?: string;
    assignedTo?: string; // User ID/email
    fpicConsentDate?: string; // Essential for moving to Active
    fpicDocumentUrl?: string;
    persona?: "Scientific" | "Humanitarian" | "Innovation";
    documents?: GrantDocument[];
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
}
