export type SearchQuery = {
  query: string;
};


export function buildGoogleQuery(models: string[], userQuery: string): SearchQuery {
  // Zet modellen tussen quotes en voeg OR toe
  const modelQuery = models.map(m => `"${m}"`).join(' OR ');

  // Kijk of de gebruiker iets noemt over automaat, elektrisch etc.
  const lowerQuery = userQuery.toLowerCase();
  const extras: string[] = [];

  if (lowerQuery.includes('automaat')) extras.push('automaat');
  if (lowerQuery.includes('hybride')) extras.push('hybride');
  if (lowerQuery.includes('elektrisch')) extras.push('elektrisch');
  if (lowerQuery.includes('benzine')) extras.push('benzine');
  if (lowerQuery.includes('diesel')) extras.push('diesel');
  if (lowerQuery.includes('station')) extras.push('station');
  if (lowerQuery.includes('suv')) extras.push('suv');
  if (lowerQuery.includes('5-deurs') || lowerQuery.includes('5 deurs')) extras.push('"5-deurs"');
  if (lowerQuery.includes('navigatie')) extras.push('navigatie');

  const parts = [
    '(site:www.marktplaats.nl/v/auto-s/ OR site:www.autotrack.nl/a/)',
    modelQuery,
    ...extras,
    'occasion'
  ];

  return {
    query: parts.join(' ')
  };
}