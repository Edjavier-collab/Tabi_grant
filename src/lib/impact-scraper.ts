import * as cheerio from 'cheerio';

export interface ImpactMetrics {
    treesPlanted: number;
    hectaresRestored: number;
    survivalRate: number;
    patrolHours: number;
    communityMembers: number;
    speciesSighted: number;
    waterQuality: string;
    lastScrapedAt: string;
}

export async function scrapeImpactDashboard(): Promise<ImpactMetrics | null> {
    const url = process.env.IMPACT_DASHBOARD_URL || 'https://roots2river.vercel.app/impact';
    try {
        const response = await fetch(url);
        const html = await response.text();
        const $ = cheerio.load(html);

        // Selectors based on Vercel deployment structure
        return {
            treesPlanted: parseInt($('[data-metric="trees"]').text()) || parseInt($('.trees-planted').text()) || 0,
            hectaresRestored: parseFloat($('[data-metric="hectares"]').text()) || parseFloat($('.hectares').text()) || 0,
            survivalRate: parseFloat($('[data-metric="survival"]').text()) || parseFloat($('.survival-rate').text()) || 0,
            patrolHours: parseInt($('[data-metric="patrol-hours"]').text()) || parseInt($('.patrol-hours').text()) || 0,
            communityMembers: parseInt($('[data-metric="community"]').text()) || parseInt($('.community-members').text()) || 0,
            speciesSighted: parseInt($('[data-metric="species"]').text()) || parseInt($('.species-count').text()) || 0,
            waterQuality: $('[data-metric="water-quality"]').text() || $('.water-quality').text() || 'Unknown',
            lastScrapedAt: new Date().toISOString()
        };
    } catch (err) {
        console.error("Scraping failed", err);
        // Return null if external scrape blocks us instead of fake data
        return null;
    }
}
