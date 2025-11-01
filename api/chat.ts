import type { VercelRequest, VercelResponse } from '@vercel/node';

// Definir las interfaces necesarias
interface MovieData {
  title?: string;
  release_date?: string;
  overview?: string;
  genres?: Array<{ name: string }>;
  vote_average?: number;
  poster_path?: string;
  backdrop_path?: string;
}

interface SeriesData {
  name?: string;
  first_air_date?: string;
  overview?: string;
  genres?: Array<{ name: string }>;
  vote_average?: number;
  number_of_seasons?: number;
  number_of_episodes?: number;
  poster_path?: string;
  backdrop_path?: string;
}

interface ChatContext {
  currentPage: string;
  movieData?: MovieData;
  seriesData?: SeriesData;
  conversationHistory: Array<{
    id: string;
    content: string;
    isUser: boolean;
    timestamp: Date;
  }>;
  contentType?: string;
  contentData?: MovieData | SeriesData;
  imageUrl?: string | null;
}

// Importar la función getChatResponse
async function getChatResponse(message: string, context: ChatContext): Promise<string> {
  const { getChatResponse: originalGetChatResponse } = await import('../src/api/chat.js');
  return originalGetChatResponse(message, context);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Manejar preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Solo permitir POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, context } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const response = await getChatResponse(message, context);
    res.status(200).json({ response });
  } catch (error) {
    console.error('Chat API error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}