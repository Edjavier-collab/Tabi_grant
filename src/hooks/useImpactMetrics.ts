import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase/config';
import { doc, onSnapshot } from 'firebase/firestore';

export function useImpactMetrics(projectId: string) {
    const [metrics, setMetrics] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!projectId) return;

        setLoading(true);
        const unsubscribe = onSnapshot(
            doc(db, 'impactMetrics', projectId),
            (doc) => {
                if (doc.exists()) {
                    setMetrics(doc.data());
                }
                setLoading(false);
            },
            (error) => {
                console.error("Impact metrics snapshot error:", error);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [projectId]);

    async function sync() {
        setLoading(true);
        try {
            await fetch('/api/impact/scrape', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ projectId })
            });
        } catch (err) {
            console.error("Failed to sync impact metrics", err);
        } finally {
            setLoading(false);
        }
    }

    return { metrics, loading, sync };
}
