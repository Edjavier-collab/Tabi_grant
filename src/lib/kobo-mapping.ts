export const KOBO_FORM_MAPPING: Record<string, any> = {
    'tree_planting_log': {
        displayName: 'Tree Planting Log',
        uid: process.env.KOBO_TREE_PLANTING_UID || '', // Set these in .env.local when real UIDs are available
        reportSection: 'Restoration Progress',
        metrics: [
            { field: 'trees_planted', label: 'Trees Planted', aggregation: 'sum' },
            { field: 'species', label: 'Species', aggregation: 'unique_count' },
            { field: 'survival_rate', label: 'Avg Survival Rate', aggregation: 'average' },
            { field: '_geolocation', label: 'Planting Sites', aggregation: 'map_points' }
        ]
    },
    'watershed_monitoring': {
        displayName: 'Aluyan River Watershed Monitoring',
        uid: process.env.KOBO_WATERSHED_UID || '',
        reportSection: 'Environmental Impact',
        metrics: [
            { field: 'water_quality', label: 'Water Quality Index', aggregation: 'latest' },
            { field: 'turbidity', label: 'Turbidity (NTU)', aggregation: 'average' },
            { field: 'flow_rate', label: 'Flow Rate (L/s)', aggregation: 'average' }
        ]
    },
    'bantay_bukid_patrol': {
        displayName: 'Bantay Bukid Patrol Report',
        uid: process.env.KOBO_PATROL_UID || '',
        reportSection: 'Community Protection',
        metrics: [
            { field: 'patrol_date', label: 'Total Patrols', aggregation: 'count' },
            { field: 'incidents', label: 'Incidents Reported', aggregation: 'sum' },
            { field: 'area_covered_ha', label: 'Area Covered (ha)', aggregation: 'sum' },
            { field: 'threats_detected', label: 'Threats Detected', aggregation: 'list' }
        ]
    },
    'photo_story': {
        displayName: 'Roots & Rivers: Photo Story',
        uid: process.env.KOBO_PHOTO_UID || '',
        reportSection: 'Visual Evidence',
        metrics: [
            { field: 'photo', label: 'Photos Collected', aggregation: 'count' },
            { field: 'caption', label: 'Stories Documented', aggregation: 'list' }
        ]
    }
};
