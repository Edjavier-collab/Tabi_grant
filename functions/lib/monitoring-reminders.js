"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkMonitoringDeadlines = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
if (!admin.apps.length) {
    admin.initializeApp();
}
const db = admin.firestore();
exports.checkMonitoringDeadlines = functions.pubsub
    .schedule('0 8 * * *') // Run daily at 8am
    .timeZone('America/Los_Angeles')
    .onRun(async (context) => {
    const now = new Date();
    // Get all active grants
    const grantsSnapshot = await db
        .collection('grants')
        .where('currentStage', '==', 'Active') // Match actual Tabi schema stage names
        .get();
    for (const grantDoc of grantsSnapshot.docs) {
        // Get upcoming monitoring reports
        const reportsSnapshot = await db
            .collection('grants')
            .doc(grantDoc.id)
            .collection('monitoringReports')
            .where('status', '==', 'upcoming')
            .get();
        for (const reportDoc of reportsSnapshot.docs) {
            const report = reportDoc.data();
            if (!report.dueDate)
                continue;
            const dueDate = report.dueDate.toDate ? report.dueDate.toDate() : new Date(report.dueDate);
            const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            if (daysUntilDue === 14) {
                await triggerDataSync(grantDoc.id, reportDoc.id);
            }
            if (daysUntilDue === 7) {
                await triggerReportGeneration(grantDoc.id, reportDoc.id);
            }
            if (daysUntilDue === 1) {
                await triggerEmailDraft(grantDoc.id, reportDoc.id);
            }
            if ([30, 14, 7, 1, 0].includes(daysUntilDue)) {
                await createNotification(grantDoc.id, reportDoc.id, daysUntilDue);
            }
        }
    }
});
async function triggerDataSync(grantId, reportId) {
    // In a real environment, trigger the Next.js API route via signed request
    console.log(`Triggering KoBo & Impact data sync for ${grantId} / ${reportId}`);
}
async function triggerReportGeneration(grantId, reportId) {
    console.log(`Triggering auto-report generation for ${grantId} / ${reportId}`);
}
async function triggerEmailDraft(grantId, reportId) {
    console.log(`Triggering cover email draft for ${grantId} / ${reportId}`);
}
async function createNotification(grantId, reportId, daysUntilDue) {
    const urgency = daysUntilDue <= 1 ? 'urgent' : daysUntilDue <= 7 ? 'high' : 'normal';
    await db.collection('notifications').add({
        grantId,
        reportId,
        type: 'monitoring_reminder',
        message: `Monitoring report due in ${daysUntilDue} days`,
        urgency,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        read: false
    });
}
//# sourceMappingURL=monitoring-reminders.js.map