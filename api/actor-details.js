import { getActorDetails } from './_openai-utils.js';

// Función serverless para detalles de actores
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
    const { actorName } = req.body;
    
    if (!actorName) {
      return res.status(400).json({ error: 'Actor name is required' });
    }
    
    console.log(`Obteniendo detalles del actor: ${actorName}`);
    
    const details = await getActorDetails(actorName);
    
    res.status(200).json(details);
  } catch (error) {
    console.error('Actor details error:', error);
    res.status(500).json({ error: 'Error fetching actor details' });
  }
}