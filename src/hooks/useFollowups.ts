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

        return items;
    }, [grants]);
}
