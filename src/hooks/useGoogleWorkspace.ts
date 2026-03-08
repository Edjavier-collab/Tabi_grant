import { useState } from 'react';

export function useGmail() {
    const [loading, setLoading] = useState(false);

    async function listEmails(query: string) {
        setLoading(true);
        const response = await fetch(`/api/gmail/list?query=${encodeURIComponent(query)}`);
        setLoading(false);
        return response.json();
    }

    async function sendEmail(to: string, subject: string, body: string, attachment?: string) {
        setLoading(true);
        const response = await fetch('/api/gmail/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ to, subject, body, attachment })
        });
        setLoading(false);
        return response.json();
    }

    async function createDraft(to: string, subject: string, body: string, isHtml: boolean = false) {
        setLoading(true);
        const response = await fetch('/api/gmail/draft', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ to, subject, body, isHtml })
        });
        setLoading(false);
        return response.json();
    }

    return { listEmails, sendEmail, createDraft, loading };
}

export function useCalendar() {
    const [loading, setLoading] = useState(false);

    async function listEvents(timeMin: string, timeMax: string) {
        setLoading(true);
        const response = await fetch(`/api/calendar/events?timeMin=${timeMin}&timeMax=${timeMax}`);
        setLoading(false);
        return response.json();
    }

    async function createEvent(summary: string, start: string, end: string, description?: string) {
        setLoading(true);
        const response = await fetch('/api/calendar/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ summary, start, end, description })
        });
        setLoading(false);
        return response.json();
    }

    return { listEvents, createEvent, loading };
}

export function useDrive() {
    const [loading, setLoading] = useState(false);

    async function uploadFile(file: File, folderId: string) {
        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folderId', folderId);

        const response = await fetch('/api/drive/upload', {
            method: 'POST',
            body: formData
        });
        setLoading(false);
        return response.json();
    }

    async function listFiles(folderId: string) {
        setLoading(true);
        const response = await fetch(`/api/drive/list?folderId=${folderId}`);
        setLoading(false);
        return response.json();
    }

    return { uploadFile, listFiles, loading };
}
