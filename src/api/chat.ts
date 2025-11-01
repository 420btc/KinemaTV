import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

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
  conversationHistory: ChatMessage[];
  contentType?: string;
  contentData?: MovieData | SeriesData;
  imageUrl?: string | null;
}

export async function getChatResponse(message: string, context: ChatContext): Promise<string> {
  try {
    // Construir el contexto del sistema
    let systemPrompt = `Eres un asistente experto en películas y series de TV. Tienes acceso a información detallada sobre contenido audiovisual y puedes ayudar con recomendaciones, análisis, trivia, y responder preguntas específicas.

Contexto actual:
- Página actual: ${context.currentPage}`;

    // Agregar información específica según la página
    if (context.currentPage.includes('/movie/') && context.movieData) {
      systemPrompt += `
- El usuario está viendo detalles de la película: "${context.movieData.title}" (${context.movieData.release_date?.split('-')[0]})
- Sinopsis: ${context.movieData.overview}
- Géneros: ${context.movieData.genres?.map((g) => g.name).join(', ')}
- Calificación: ${context.movieData.vote_average}/10`;
    }

    if (context.currentPage.includes('/tv/') && context.seriesData) {
      systemPrompt += `
- El usuario está viendo detalles de la serie: "${context.seriesData.name}" (${context.seriesData.first_air_date?.split('-')[0]})
- Sinopsis: ${context.seriesData.overview}
- Géneros: ${context.seriesData.genres?.map((g) => g.name).join(', ')}
- Calificación: ${context.seriesData.vote_average}/10
- Temporadas: ${context.seriesData.number_of_seasons}
- Episodios: ${context.seriesData.number_of_episodes}`;
    }

    if (context.currentPage === '/') {
      systemPrompt += `
- El usuario está en la página de inicio, donde puede ver películas y series populares`;
    }

    if (context.currentPage === '/search') {
      systemPrompt += `
- El usuario está en la página de búsqueda`;
    }

    if (context.currentPage === '/explore') {
      systemPrompt += `
- El usuario está explorando contenido`;
    }

    if (context.currentPage === '/favorites') {
      systemPrompt += `
- El usuario está viendo sus películas y series favoritas`;
    }

    if (context.currentPage === '/watchlist') {
      systemPrompt += `
- El usuario está viendo su lista de contenido para ver más tarde`;
    }

    systemPrompt += `

Instrucciones:
1. Responde en español de manera conversacional y amigable
2. Si el usuario pregunta sobre la película/serie actual, usa la información del contexto
3. Puedes hacer recomendaciones basadas en lo que está viendo
4. Si no tienes información específica, puedes usar tu conocimiento general sobre cine y TV
5. Mantén las respuestas concisas pero informativas
6. Si el usuario pregunta sobre funcionalidades de la app, explica que puede agregar contenido a favoritos o watchlist
7. Puedes sugerir contenido similar o relacionado
8. Si se proporciona una imagen (portada de película/serie), puedes analizarla y comentar sobre el diseño, colores, elementos visuales, etc.`;

    // Construir el historial de conversación para OpenAI
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: systemPrompt
      }
    ];

    // Agregar historial de conversación (últimos 10 mensajes)
    const recentHistory = context.conversationHistory.slice(-10);
    for (const msg of recentHistory) {
      messages.push({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.content
      });
    }

    // Agregar el mensaje actual
    if (context.imageUrl) {
      // Si hay una imagen, usar el modelo de visión
      messages.push({
        role: 'user',
        content: [
          {
            type: 'text',
            text: message
          },
          {
            type: 'image_url',
            image_url: {
              url: context.imageUrl
            }
          }
        ]
      });
    } else {
      // Sin imagen, solo texto
      messages.push({
        role: 'user',
        content: message
      });
    }

    const completion = await openai.chat.completions.create({
      model: context.imageUrl ? 'gpt-4o' : 'gpt-4o-mini',
      messages: messages,
      max_tokens: 500,
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || 'Lo siento, no pude generar una respuesta.';
  } catch (error) {
    console.error('Error in chat service:', error);
    throw new Error('Error al procesar la solicitud de chat');
  }
}

// Función para obtener recomendaciones basadas en el contenido actual
export async function getRecommendations(contentType: 'movie' | 'tv', contentData: MovieData | SeriesData): Promise<string> {
  try {
    const systemPrompt = `Eres un experto en recomendaciones de ${contentType === 'movie' ? 'películas' : 'series'}. 
    Basándote en el siguiente contenido, proporciona 3-5 recomendaciones similares con una breve explicación de por qué son similares.
    
    ${contentType === 'movie' ? 'Película' : 'Serie'} actual:
    - Título: ${(contentData as MovieData).title || (contentData as SeriesData).name}
    - Géneros: ${contentData.genres?.map((g) => g.name).join(', ')}
    - Sinopsis: ${contentData.overview}
    
    Responde en español de manera conversacional.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: `Dame recomendaciones similares a esta ${contentType === 'movie' ? 'película' : 'serie'}`
        }
      ],
      max_tokens: 400,
      temperature: 0.8,
    });

    return completion.choices[0]?.message?.content || 'No pude generar recomendaciones en este momento.';
  } catch (error) {
    console.error('Error getting recommendations:', error);
    throw new Error('Error al obtener recomendaciones');
  }
}