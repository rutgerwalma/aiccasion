/////////////////////////////////////
//
// Niet functioneel, probeerseltje
//
/////////////////////////////////////

import type { NextApiRequest, NextApiResponse } from 'next';

type AutoHeroCar = {
  licensePlate: string;
  [key: string]: any; // overige velden van AutoHero response
};

type RDWData = {
  kenteken?: string;
  merk?: string;
  // voeg hier eventueel meer RDW velden toe als je wilt
};

type CarWithRDW = AutoHeroCar & {
  rdw: RDWData | null;
};

type ResponseData = {
  cars: CarWithRDW[];
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    const { page = '1' } = req.query;

    // 1) AutoHero data ophalen
    const autoHeroRes = await fetch(
        `https://www.autohero.com/nl/search/api/search?sort=price-asc&page=${page}`,
        {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
                          '(KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
            'Accept': 'application/json, text/plain, */*',
            'Accept-Language': 'nl-NL,nl;q=0.9,en-US;q=0.8,en;q=0.7',
            'Referer': 'https://www.autohero.com/nl/',
            'Origin': 'https://www.autohero.com',
          },
        }
      );
      

    if (!autoHeroRes.ok) {
      return res.status(500).json({ cars: [], error: 'Fout bij ophalen AutoHero data' });
    }

    const autoHeroJson = await autoHeroRes.json();

    const cars: AutoHeroCar[] = autoHeroJson.items || [];

    // 2) Voor elke auto RDW data ophalen (op kenteken)
    const rdwBaseUrl = 'https://opendata.rdw.nl/resource/m9d7-ebf2.json';

    const carsWithRDW: CarWithRDW[] = await Promise.all(
      cars.map(async (car) => {
        try {
          const kenteken = car.licensePlate.replace(/\s+/g, '').toUpperCase();

          const rdwRes = await fetch(`${rdwBaseUrl}?kenteken=${kenteken}`);

          if (!rdwRes.ok) {
            return { ...car, rdw: null };
          }

          const rdwData: RDWData[] = await rdwRes.json();

          return {
            ...car,
            rdw: rdwData[0] || null,
          };
        } catch {
          return { ...car, rdw: null };
        }
      })
    );

    return res.status(200).json({ cars: carsWithRDW });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ cars: [], error: 'Interne serverfout' });
  }
}
