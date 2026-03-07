import { useMemo } from "react";
import { Grant } from "@/types/grant";

export interface FollowupItem {
    grant: Grant;
    type: "follow_up_1" | "follow_up_2" | "status_check" | "re_engage" | "report_due";
    label: string;
    urgency: "critical" | "warning" | "info";
    daysSince: number;
}

const MS_PER_DAY = 1000 * 60 * 60 * 24;

function daysBetween(dateA: string, dateB: Date): number {
    return Math.floor((dateB.getTime() - new Date(dateA).getTime()) / MS_PER_DAY);
}

/**
 * Analyzes an array of grants and returns action items based on
 * the follow-up rules from the blueprint.
 */
export function useFollowups(grants: Grant[]): FollowupItem[] {
    const now = new Date();

    return useMemo(() => {
        const items: FollowupItem[] = [];

        grants.forEach((grant) => {
            const daysSinceUpdate = daysBetween(grant.updatedAt, now);

            // Rule 1: LOI submitted + 14 days, no response → Follow-up #1
            if (grant.currentStage === "LOI Submitted" && daysSinceUpdate >= 14 && daysSinceUpdate < 30) {
                items.push({
                    grant,
                    type: "follow_up_1",
                    label: `Follow up: ${grant.funderName} (LOI sent ${daysSinceUpdate} days ago)`,
                    urgency: "warning",
                    daysSince: daysSinceUpdate,
                });
            }

            // Rule 2: LOI submitted + 30 days, no response → Follow-up #2 (urgent)
            if (grant.currentStage === "LOI Submitted" && daysSinceUpdate >= 30) {
                items.push({
                    grant,
                    type: "follow_up_2",
                    label: `URGENT: ${grant.funderName} — no response in ${daysSinceUpdate} days`,
                    urgency: "critical",
                    daysSince: daysSinceUpdate,
                });
            }

            // Rule 3: Proposal submitted + 60 days → Status check
            if (grant.currentStage === "Proposal Submitted" && daysSinceUpdate >= 60) {
                items.push({
                    grant,
                    type: "status_check",
                    label: `Status check: ${grant.funderName} (proposal sent ${daysSinceUpdate} days ago)`,
                    urgency: "warning",
                    daysSince: daysSinceUpdate,
                });
            }

            // Rule 4: Last contact > 45 days (any non-terminal stage)
            const terminalStages = ["Declined", "Closed"];
            if (!terminalStages.includes(grant.currentStage) && daysSinceUpdate > 45) {
                // Avoid duplicating if already flagged above
                const alreadyFlagged = items.some((i) => i.grant.id === grant.id);
                if (!alreadyFlagged) {
                    items.push({
                        grant,
                        type: "re_engage",
                        label: `Re-engage: ${grant.funderName} — last activity ${daysSinceUpdate} days ago`,
                        urgency: "info",
                        daysSince: daysSinceUpdate,
                    });
                }
            }

            // Rule 5: Upcoming LOI deadline within 7 days
            if (grant.loiDeadline) {
                const daysUntilDeadline = daysBetween(now.toISOString(), new Date(grant.loiDeadline));
                if (daysUntilDeadline >= 0 && daysUntilDeadline <= 7 && grant.currentStage !== "LOI Submitted") {
                    items.push({
                        grant,
                        type: "report_due",
                        label: `LOI deadline in ${daysUntilDeadline} days: ${grant.funderName}`,
                        urgency: daysUntilDeadline <= 2 ? "critical" : "warning",
                        daysSince: daysUntilDeadline,
                    });
                }
            }
        });

        // Sort by urgency: critical > warning > info
        const urgencyOrder = { critical: 0, warning: 1, info: 2 };
        items.sort((a, b) => urgencyOrder[a.urgency] - urgencyOrder[b.urgency]);

        // DEMO MODE: If no real items, show sample data so the UI is visible
        if (items.length === 0) {
            const demoGrant: Grant = {
                id: "demo-001",
                funderName: "Moore Foundation",
                amountRequested: 75000,
                projectLinked: "Roots & Rivers",
                currentStage: "LOI Submitted",
                createdAt: new Date(Date.now() - 35 * MS_PER_DAY).toISOString(),
                updatedAt: new Date(Date.now() - 35 * MS_PER_DAY).toISOString(),
                primaryContact: { name: "J. Martinez", email: "grants@moore.org" },
            };
            const demoGrant2: Grant = {
                id: "demo-002",
                funderName: "Packard Foundation",
                amountRequested: 50000,
                projectLinked: "Roots & Rivers",
                currentStage: "LOI Submitted",
                createdAt: new Date(Date.now() - 18 * MS_PER_DAY).toISOString(),
                updatedAt: new Date(Date.now() - 18 * MS_PER_DAY).toISOString(),
            };
            const demoGrant3: Grant = {
                id: "demo-003",
                funderName: "Christensen Fund",
                amountRequested: 120000,
                projectLinked: "Watershed Protection",
                currentStage: "Prospect",
                createdAt: new Date(Date.now() - 50 * MS_PER_DAY).toISOString(),
                updatedAt: new Date(Date.now() - 50 * MS_PER_DAY).toISOString(),
            };
            items.push(
                { grant: demoGrant, type: "follow_up_2", label: "URGENT: Moore Foundation — no response in 35 days (demo)", urgency: "critical", daysSince: 35 },
                { grant: demoGrant2, type: "follow_up_1", label: "Follow up: Packard Foundation (LOI sent 18 days ago) (demo)", urgency: "warning", daysSince: 18 },
                { grant: demoGrant3, type: "re_engage", label: "Re-engage: Christensen Fund — last activity 50 days ago (demo)", urgency: "info", daysSince: 50 },
            );
        }

        return items;
    }, [grants]);
}
