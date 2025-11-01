import dotenv from 'dotenv';

dotenv.config();

// Función serverless para análisis de series
export default async function handler(req, res) {
  // Solo permitir POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Importación dinámica del módulo de análisis
    const movieAnalysisModule = await import('../src/api/movie-analysis.js');
    
    const { seriesTitle, seriesYear, seriesGenres } = req.body;
    
    if (!seriesTitle) {
      return res.status(400).json({ error: 'Series title is required' });
    }
    
    // Usar año actual si no se proporciona
    const releaseYear = seriesYear || new Date().getFullYear();
    
    const analysis = await movieAnalysisModule.handleSeriesAnalysis({
      seriesTitle,
      releaseYear
    });
    
    res.status(200).json(analysis);
  } catch (error) {
    console.error('Series analysis error:', error);
    res.status(500).json({ error: 'Error analyzing series' });
  }
}