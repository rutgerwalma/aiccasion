import type { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai';
import { buildGoogleQuery } from '../../lib/buildGoogleQuery';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

type Message = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

type SearchResult = {
  title: string;
  link: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{
    reply: string;
    searchResults?: SearchResult[];
    searching?: boolean;
    error?: string;
  }>
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ reply: '', error: 'Method not allowed' });
  }

  const { messages } = req.body as { messages: Message[] };
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ reply: '', error: 'Invalid messages' });
  }

  const systemPrompt = `
    Je bent een deskundige autoaankoopadviseur. Je helpt mensen zoeken naar occasions via Google.
    Vraag altijd eerst goed door tot je voldoende weet om een gerichte zoekopdracht te maken.
    
    Let op:
    - Bouwjaar, prijs en kilometerstand zijn vaak NIET goed vindbaar via Google en moeten daarom NIET in de zoekopdracht.
    - Zoek wel op eigenschappen die vaak in titels staan: automaat, elektrisch, hybride, station, SUV, 5-deurs, of specifieke uitvoeringen zoals M-Sport, GT-Line, Executive.
    - Gebruik alleen deze autosites: www.marktplaats.nl/v/auto-s/ en www.autotrack.nl/a/ (met OR ertussen).
    - Kies echte automodellen die passen bij de wensen, in het formaat: "Toyota Yaris", "Mazda 2", etc.
    - Kies wel voor specifieke modellen en niet reeksen waar dat van toepassing is, dus NIET "BMW 1-serie", maar "BMW 118i" en niet Mercedes-Benz A-Klasse maar Mercedes-Benz A180 bijvoorbeeld.
    
    Als je genoeg weet:
    
    1. Geef een lijst van 3–7 geschikte modellen.
    2. Bouw een Google zoekopdracht met deze modellen en bijpassende kenmerken.
    
    Geef daarna ALLEEN deze regel:
    SEARCH: <zoekopdracht>
  `;

  try {
    const chatMessages: Message[] = [
      { role: 'system', content: systemPrompt.trim() },
      ...messages,
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: chatMessages,
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0].message.content.trim();

    const searchLine = aiResponse
    .split('\n')
    .find(line => line.trim().toUpperCase().startsWith('SEARCH:'));
  
  if (searchLine) {
    const rawSearch = searchLine.replace(/SEARCH:/i, '').trim();

    // Domeinen eruit filteren
    const modelPart = rawSearch
      .replace(/site:[^\s]+/g, '') // verwijdert site:... stukken
      .replace(/\s+OR\s+/gi, ',') // vervang OR door komma's voor simpele splitsing
      .replace(/["']/g, '') // verwijder quotes
      .replace(/\d{4}\.\.\d{4}/g, '') // haal jaartallenrange weg
      .replace(/€\d+/g, '') // verwijder prijs
      .replace(/\boccasion\b/gi, '') // verwijder 'occasion'
      .trim();
  
    const models = modelPart
      .split(',')
      .map(m => m.trim())
      .filter(m => m.length > 0);
  
    // Gebruik de originele user prompt om bouwjaar en prijs af te leiden
    const userPrompt = messages.at(-1)?.content || '';
  
    const searchQuery = buildGoogleQuery(models, userPrompt);
    const { query } = searchQuery;

    console.log(query);
  
    const searchRes = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/google-search`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      }
    );

    console.log('results', searchRes)
  
    if (!searchRes.ok) {
      const errorJson = await searchRes.json();
      throw new Error(
        `Google Search API error: ${errorJson.error || searchRes.statusText}`
      );
    }
  
    const json = await searchRes.json();
    const results = json.results as SearchResult[];
  
    return res.status(200).json({
      reply: 'Ik heb enkele relevante advertentie-zoekresultaten gevonden:',
      searchResults: results,
    });
  } else {
    return res.status(200).json({ reply: aiResponse });
  }
  } catch (error: any) {
    return res.status(500).json({ reply: '', error: error.message || 'Server error' });
  }
}
