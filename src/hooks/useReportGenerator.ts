import { useState } from 'react';

export interface ReportConfig {
    grantId: string;
    reportType: 'quarterly' | 'annual' | 'final' | string;
    reportingPeriod: { start: string; end: string };
    donorPersona: 'scientific' | 'humanitarian' | 'innovation' | string;
    outputFormat: 'docx' | 'email' | 'both';
    includeGlossary: boolean;
    includePhotos: boolean;
    saveToDrive?: boolean;
}

export function useReportGenerator() {
    const [generating, setGenerating] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    async function generate(config: ReportConfig) {
        setGenerating(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch('/api/reports/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config)
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to generate report');

            setResult(data);
            return data;
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setGenerating(false);
        }
    }

    return { generate, generating, result, error };
}
