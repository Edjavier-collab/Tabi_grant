export type ActivityType = "created" | "updated" | "archived" | "restored" | "deleted" | "stage_change";

export interface ActivityLog {
    id: string;
    grantId: string;
    funderName: string;
    type: ActivityType;
    details: string;
    userId?: string;
    userName?: string;
    timestamp: string; // ISO string
}
