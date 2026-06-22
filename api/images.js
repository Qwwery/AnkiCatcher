// api/images.js

const OPENVERSE_ENDPOINT = 'https://api.openverse.org/v1/images/';

function cleanSearchQuery(text) {
    return text.trim().replace(/[.,!?;:'"()]/g, '').replace(/\s+/g, ' ').toLowerCase();
}

export async function getImageUrl(text) {
    try {
        const query = cleanSearchQuery(text).split(/\s+/)[0];

        const params = new URLSearchParams({
            q: query,
            per_page: '1',
            license: 'by,by-sa,by-nd,cc0,publicdomain',
            size: 'medium'
        });

        const url = `${OPENVERSE_ENDPOINT}?${params}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        if (data.results && data.results.length > 0) {
            const image = data.results[0];
            return image.thumbnail || image.url;
        }

        throw new Error('Изображение не найдено');

    } catch (error) {
        console.error('Openverse error:', error);
        // Вместо via.placeholder.com используй:
        return `https://placehold.co/400x300/4CAF50/ffffff?text=${encodeURIComponent(text.substring(0, 20))}`;
    }
}