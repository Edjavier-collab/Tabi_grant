import { useState, useEffect, useCallback } from 'react';
import { koboApi } from '@/lib/kobo-api';

export function useKoboForms() {
    const [forms, setForms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchForms() {
            try {
                const response = await fetch('/api/kobo/forms');
                if (response.ok) {
                    const data = await response.json();
                    setForms(data.results || []);
                }
            } catch (err) {
                console.error("Failed to fetch forms", err);
            } finally {
                setLoading(false);
            }
        }
        fetchForms();
    }, []);

    return { forms, loading };
}

export function useKoboSync() {
    const [syncing, setSyncing] = useState(false);

    const sync = useCallback(async () => {
        setSyncing(true);
        try {
            await fetch('/api/kobo/sync', { method: 'POST' });
        } catch (err) {
            console.error("Sync failed", err);
        } finally {
            setSyncing(false);
        }
    }, []);

    return { sync, syncing };
}

export function useKoboData(formId: string) {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const response = await fetch(`/api/kobo/data/${formId}`);
                if (response.ok) {
                    const result = await response.json();
                    setData(result);
                }
            } catch (err) {
                console.error("Failed to fetch kobo data", err);
            } finally {
                setLoading(false);
            }
        }
        if (formId) fetchData();
    }, [formId]);

    return { data, loading };
}
