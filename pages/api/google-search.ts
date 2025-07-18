import type { NextApiRequest, NextApiResponse } from 'next';

type SearchResult = {
  title: string;
  link: string;
  thumbnail?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ results: SearchResult[]; error?: string }>
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ results: [], error: 'Method not allowed' });
  }

  const { query } = req.body;
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ results: [], error: 'Invalid query' });
  }

  const apiKey = process.env.GOOGLE_API_KEY!;
  const cseId = process.env.GOOGLE_CSE_ID!;

  try {
    const searchUrl = new URL('https://www.googleapis.com/customsearch/v1');
    searchUrl.searchParams.set('key', apiKey);
    searchUrl.searchParams.set('cx', cseId);
    searchUrl.searchParams.set('q', query);
    searchUrl.searchParams.set('num', '10');

    const response = await fetch(searchUrl.toString());

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ results: [], error: errorText });
    }

    const data = await response.json();

    // Map Google Search API resultaten naar jouw formaat
    const results: SearchResult[] = (data.items ?? []).map((item: any) => {
      let thumbnail: string | undefined = undefined;

      // Check of er een thumbnail is in pagemap cse_thumbnail of image object
      if (item.pagemap?.cse_thumbnail?.[0]?.src) {
        thumbnail = item.pagemap.cse_thumbnail[0].src;
      } else if (item.image?.thumbnailLink) {
        thumbnail = item.image.thumbnailLink;
      }

      return {
        title: item.title,
        link: item.link,
        thumbnail,
      };
    });

    return res.status(200).json({ results });
  } catch (error: any) {
    return res.status(500).json({ results: [], error: error.message || 'Server error' });
  }
}
