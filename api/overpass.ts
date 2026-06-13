import type { VercelRequest, VercelResponse } from '@vercel/node';

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const query: string | undefined =
        typeof req.body === 'object' && req.body !== null
            ? (req.body as Record<string, string>).query
            : undefined;

    if (!query) {
        return res.status(400).json({ error: 'Missing query' });
    }

    const formData = new URLSearchParams();
    formData.append('data', query);

    const response = await fetch(OVERPASS_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'DoeSangueApp/1.0',
        },
        body: formData.toString(),
    });

    if (!response.ok) {
        return res.status(response.status).json({ error: `Overpass API error: ${response.status}` });
    }

    const data = await response.json();
    return res.status(200).json(data);
}
