import { getMovieAnalysis } from './_openai-utils.js';

// Función serverless para análisis de películas
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
    const { movieTitle, movieYear, movieGenres } = req.body;
    
    if (!movieTitle) {
      return res.status(400).json({ error: 'Movie title is required' });
    }
    
    // Usar año actual si no se proporciona
    const releaseYear = movieYear || new Date().getFullYear();
    
    console.log(`Analizando película: ${movieTitle} (${releaseYear})`);
    
    const analysis = await getMovieAnalysis(movieTitle, releaseYear);
    
    res.status(200).json(analysis);
  } catch (error) {
    console.error('Movie analysis error:', error);
    res.status(500).json({ error: 'Error analyzing movie' });
  }
}