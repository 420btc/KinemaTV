export default async function handler(req, res) {
  // Solo permitir métodos POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Importar dinámicamente el módulo de análisis de películas
    const movieAnalysisModule = await import('../src/api/movie-analysis.ts');
    
    // Extraer datos del cuerpo de la petición
    const { actorName } = req.body;
    
    if (!actorName) {
      return res.status(400).json({ error: 'Actor name is required' });
    }
    
    // Obtener detalles del actor usando la función del módulo
    const details = await movieAnalysisModule.handleActorDetails(actorName);
    
    // Devolver los detalles
    res.status(200).json(details);
  } catch (error) {
    console.error('Actor details error:', error);
    res.status(500).json({ error: 'Error fetching actor details' });
  }
}