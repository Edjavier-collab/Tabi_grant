const KOBO_API_URL = process.env.KOBO_API_URL || 'https://kf.kobotoolbox.org/api/v2';
const KOBO_API_KEY = process.env.KOBO_API_KEY;

function getHeaders() {
    if (!KOBO_API_KEY) {
        console.error('[Kobo] KOBO_API_KEY is not set — all API calls will fail');
    }
    return { 'Authorization': `Token ${KOBO_API_KEY}` };
}

export const koboApi = {
    async getForms() {
        const response = await fetch(`${KOBO_API_URL}/assets/`, {
            headers: getHeaders(),
        });
        if (!response.ok) {
            console.error(`[Kobo] getForms failed: ${response.status} ${response.statusText}`);
        }
        return response.json();
    },

    async getFormData(assetUid: string) {
        const response = await fetch(`${KOBO_API_URL}/assets/${assetUid}/data/`, {
            headers: getHeaders(),
        });
        if (!response.ok) {
            console.error(`[Kobo] getFormData(${assetUid}) failed: ${response.status} ${response.statusText}`);
        }
        return response.json();
    },

    async getFormSubmissions(assetUid: string, limit = 100) {
        const response = await fetch(
            `${KOBO_API_URL}/assets/${assetUid}/data/?limit=${limit}&sort={"_submission_time":-1}`,
            { headers: getHeaders() }
        );
        if (!response.ok) {
            console.error(`[Kobo] getFormSubmissions(${assetUid}) failed: ${response.status} ${response.statusText}`);
        }
        return response.json();
    }
};
