import { db } from "./config";
import {
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    onSnapshot
} from "firebase/firestore";
import { Grant, Stage } from "@/types/grant";

const GRANTS_COLLECTION = "grants";

// Helper to get typed reference
const getGrantsRef = () => collection(db, GRANTS_COLLECTION);

export const addGrant = async (grantData: Omit<Grant, "id" | "createdAt" | "updatedAt">) => {
    const now = new Date().toISOString();
    const newGrant = {
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
    return docRef.id;
};

export const updateGrantStage = async (id: string, newStage: Stage, additionalData?: Partial<Grant>) => {
    const docRef = doc(db, GRANTS_COLLECTION, id);
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

export const deleteGrant = async (id: string) => {
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
