import { db } from "./config";
import {
    collection,
    doc,
    addDoc,
    setDoc,
    getDoc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    limit,
    onSnapshot
} from "firebase/firestore";
import { Grant, Stage } from "@/types/grant";
import { ActivityLog, ActivityType } from "@/types/activity";

const GRANTS_COLLECTION = "grants";
const USER_TOKENS_COLLECTION = "userTokens";
const ACTIVITY_COLLECTION = "activity";

// Helper to get typed reference
const getGrantsRef = () => collection(db, GRANTS_COLLECTION);
const getActivityRef = () => collection(db, ACTIVITY_COLLECTION);

/**
 * Log an activity to Firestore
 */
export const logActivity = async (grant: Partial<Grant>, type: ActivityType, details: string) => {
    try {
        await addDoc(getActivityRef(), {
            grantId: grant.id || "unknown",
            funderName: grant.funderName || "Unknown Funder",
            type,
            details,
            timestamp: new Date().toISOString(),
        });
    } catch (e) {
        console.error("Failed to log activity:", e);
    }
};

/**
 * Save Google OAuth tokens for a specific user ID.
 */
export const saveUserTokens = async (userId: string, tokens: { access_token?: string | null; refresh_token?: string | null }) => {
    const docRef = doc(db, USER_TOKENS_COLLECTION, userId);
    
    // We only update if the token exists to avoid overwriting existing refresh tokens
    const updateData: Record<string, unknown> = {
        updatedAt: new Date().toISOString(),
    };
    
    if (tokens.access_token) updateData.access_token = tokens.access_token;
    if (tokens.refresh_token) updateData.refresh_token = tokens.refresh_token;

    await setDoc(docRef, updateData, { merge: true });
};

/**
 * Retrieve saved tokens for a user.
 */
export const getUserTokens = async (userId: string) => {
    const docRef = doc(db, USER_TOKENS_COLLECTION, userId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
        return snap.data() as { access_token: string; refresh_token: string };
    }
    return null;
};

export const addGrant = async (grantData: Omit<Grant, "id" | "createdAt" | "updatedAt">) => {
    const now = new Date().toISOString();
    const newGrant = {
        status: "active" as const,
        ...grantData,
        createdAt: now,
        updatedAt: now,
    };

    // Firebase throws errors if any field explicitly has a value of `undefined`.
    // We strip them out before inserting.
    const sanitizedGrant = newGrant as Record<string, unknown>;
    Object.keys(sanitizedGrant).forEach(key => {
        if (sanitizedGrant[key] === undefined) {
            delete sanitizedGrant[key];
        }
    });

    const docRef = await addDoc(getGrantsRef(), newGrant);
    
    // Log Activity
    await logActivity({ id: docRef.id, ...newGrant }, "created", `Initialized target for ${grantData.funderName}`);
    
    return docRef.id;
};

export const updateGrantStage = async (id: string, newStage: Stage, additionalData?: Partial<Grant>) => {
    const docRef = doc(db, GRANTS_COLLECTION, id);
    
    // Get existing grant for logging
    const snap = await getDoc(docRef);
    const oldData = snap.data() as Grant;

    const updateData: Record<string, unknown> = {
        currentStage: newStage,
        updatedAt: new Date().toISOString(),
        ...(additionalData || {})
    };

    Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined) {
            delete updateData[key];
        }
    });

    await updateDoc(docRef, updateData);

    // Log Activity
    if (oldData.currentStage !== newStage) {
        await logActivity({ ...oldData, id }, "stage_change", `Moved from ${oldData.currentStage} to ${newStage}`);
    }
};

export const updateGrant = async (id: string, data: Partial<Grant>) => {
    const docRef = doc(db, GRANTS_COLLECTION, id);
    const sanitized: Record<string, unknown> = { ...data, updatedAt: new Date().toISOString() };
    Object.keys(sanitized).forEach(key => {
        if (sanitized[key] === undefined) {
            delete sanitized[key];
        }
    });
    await updateDoc(docRef, sanitized);
};

export const archiveGrant = async (id: string) => {
    const docRef = doc(db, GRANTS_COLLECTION, id);
    const snap = await getDoc(docRef);
    const data = snap.data() as Grant;
    
    await updateGrant(id, { status: "archived" });
    await logActivity({ ...data, id }, "archived", `Archived grant: ${data.funderName}`);
};

export const restoreGrant = async (id: string) => {
    const docRef = doc(db, GRANTS_COLLECTION, id);
    const snap = await getDoc(docRef);
    const data = snap.data() as Grant;

    await updateGrant(id, { status: "active" });
    await logActivity({ ...data, id }, "restored", `Restored grant: ${data.funderName}`);
};

export const deleteGrant = async (id: string) => {
    const docRef = doc(db, GRANTS_COLLECTION, id);
    const snap = await getDoc(docRef);
    const data = snap.data() as Grant;

    await updateGrant(id, { status: "deleted" });
    await logActivity({ ...data, id }, "deleted", `Soft-deleted grant: ${data.funderName}`);
};

export const hardDeleteGrant = async (id: string) => {
    const docRef = doc(db, GRANTS_COLLECTION, id);
    await deleteDoc(docRef);
};

// Real-time listener for grants
export const subscribeToGrants = (callback: (grants: Grant[]) => void) => {
    const q = query(getGrantsRef(), orderBy("updatedAt", "desc"));

    return onSnapshot(q, (snapshot) => {
        const grants: Grant[] = [];
        snapshot.forEach((doc) => {
            grants.push({ id: doc.id, ...doc.data() } as Grant);
        });
        callback(grants);
    });
};

// Real-time listener for activity logs
export const subscribeToActivity = (callback: (activity: ActivityLog[]) => void) => {
    const q = query(getActivityRef(), orderBy("timestamp", "desc"), limit(30));

    return onSnapshot(q, (snapshot) => {
        const logs: ActivityLog[] = [];
        snapshot.forEach((doc) => {
            logs.push({ id: doc.id, ...doc.data() } as ActivityLog);
        });
        callback(logs);
    });
};
