export default async function handler(req, res) {
  // Solo permitir métodos POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Importar dinámicamente el módulo de análisis de películas
    const movieAnalysisModule = await import('../src/api/movie-analysis.ts');
    
    // Extraer datos del cuerpo de la petición
    const { movieTitle, movieYear, movieGenres } = req.body;
    
    if (!movieTitle) {
      return res.status(400).json({ error: 'Movie title is required' });
    }
    
    // Usar año actual si no se proporciona
    const releaseYear = movieYear || new Date().getFullYear();
    
    // Realizar el análisis usando la función del módulo
    const analysis = await movieAnalysisModule.handleMovieAnalysis({
      movieTitle,
      releaseYear
    });
    
    // Devolver el análisis
    res.status(200).json(analysis);
  } catch (error) {
    console.error('Movie analysis error:', error);
    res.status(500).json({ error: 'Error analyzing movie' });
  }
}