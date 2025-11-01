import { getSeriesAnalysis } from './_openai-utils.js';

// Función serverless para análisis de series
export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Manejar preflight OPTIONS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Solo permitir POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { seriesTitle, seriesYear, seriesGenres } = req.body;
    
    if (!seriesTitle) {
      return res.status(400).json({ error: 'Series title is required' });
    }
    
    // Usar año actual si no se proporciona
    const releaseYear = seriesYear || new Date().getFullYear();
    
    console.log(`Analizando serie: ${seriesTitle} (${releaseYear})`);
    
    const analysis = await getSeriesAnalysis(seriesTitle, releaseYear);
    
    res.status(200).json(analysis);
  } catch (error) {
    console.error('Series analysis error:', error);
    res.status(500).json({ error: 'Error analyzing series' });
  }
}