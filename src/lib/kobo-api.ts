const KOBO_API_URL = process.env.KOBO_API_URL || 'https://kf.kobotoolbox.org/api/v2';
const KOBO_API_KEY = process.env.KOBO_API_KEY;

export const koboApi = {
    async getForms() {
        const response = await fetch(`${KOBO_API_URL}/assets/`, {
            headers: { 'Authorization': `Token ${KOBO_API_KEY}` }
        });
        return response.json();
    },

    async getFormData(assetUid: string) {
        const response = await fetch(`${KOBO_API_URL}/assets/${assetUid}/data/`, {
            headers: { 'Authorization': `Token ${KOBO_API_KEY}` }
        });
        return response.json();
    },

    async getFormSubmissions(assetUid: string, limit = 100) {
        const response = await fetch(
            `${KOBO_API_URL}/assets/${assetUid}/data/?limit=${limit}&sort={"_submission_time":-1}`,
            { headers: { 'Authorization': `Token ${KOBO_API_KEY}` } }
        );
        return response.json();
    }
};
