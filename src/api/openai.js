import OpenAI from 'openai';

// Configuración de OpenAI con la API key desde variables de entorno
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function getMovieAnalysis(movieTitle, releaseYear) {
  try {
    const prompt = `
Analiza en detalle la película "${movieTitle}" (${releaseYear}) y proporciona información completa en formato JSON con la siguiente estructura:

{
  "cast": [
    {
      "name": "Nombre del actor",
      "character": "Personaje que interpreta",
      "biography": "Biografía breve del actor",
      "filmography": ["Película 1", "Película 2", "Película 3"]
    }
  ],
  "boxOffice": {
    "budget": "Presupuesto de producción",
    "worldwide": "Recaudación mundial total",
    "domestic": "Recaudación doméstica (EE.UU.)",
    "international": "Recaudación internacional",
    "profitability": "Análisis de rentabilidad"
  },
  "production": {
    "studio": "Estudio de producción",
    "producers": ["Productor 1", "Productor 2"],
    "director": "Director",
    "writers": ["Guionista 1", "Guionista 2"],
    "cinematographer": "Director de fotografía",
    "composer": "Compositor de la banda sonora"
  },
  "awards": {
    "oscars": ["Premio Oscar 1", "Premio Oscar 2"],
    "goldenGlobes": ["Globo de Oro 1", "Globo de Oro 2"],
    "otherAwards": ["Otro premio 1", "Otro premio 2"]
  },
  "criticalReception": {
    "rottenTomatoes": "Puntuación en Rotten Tomatoes",
    "imdb": "Puntuación en IMDb",
    "metacritic": "Puntuación en Metacritic",
    "criticsConsensus": "Consenso de la crítica"
  },
  "culturalImpact": {
    "legacy": "Legado cultural de la película",
    "influence": "Influencia en el cine posterior",
    "trivia": ["Dato curioso 1", "Dato curioso 2", "Dato curioso 3"]
  },
  "technicalAspects": {
    "cinematography": "Análisis de la cinematografía",
    "soundtrack": "Análisis de la banda sonora",
    "visualEffects": "Análisis de efectos visuales",
    "editing": "Análisis de la edición"
  }
}

Incluye solo los 5 actores principales del reparto. Proporciona información precisa y detallada. Responde ÚNICAMENTE con el JSON válido, sin texto adicional.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Eres un experto en análisis cinematográfico. Proporciona información precisa y detallada en formato JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 4000,
    });

    const response = completion.choices[0]?.message?.content;
    
    if (!response) {
      throw new Error('No se recibió respuesta de OpenAI');
    }

    const cleanedResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    try {
      return JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('Error parsing movie analysis response:', parseError);
      throw new Error('Error al procesar análisis de la película');
    }

  } catch (error) {
    console.error('Error getting movie analysis:', error);
    throw new Error('Error al obtener análisis de la película');
  }
}

export async function getActorDetails(actorName) {
  try {
    const prompt = `
Proporciona información detallada sobre el actor/actriz "${actorName}" en formato JSON:

{
  "biography": "Biografía completa del actor",
  "filmography": ["Película destacada 1", "Película destacada 2", "Película destacada 3", "Película destacada 4", "Película destacada 5"],
  "awards": ["Premio 1", "Premio 2", "Premio 3"],
  "personalLife": "Información sobre su vida personal y carrera"
}

Responde ÚNICAMENTE con el JSON válido, sin texto adicional.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Eres un experto en biografías de actores de cine. Proporciona información precisa y detallada en formato JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 6000,
    });

    const response = completion.choices[0]?.message?.content;
    
    if (!response) {
      throw new Error('No se recibió respuesta de OpenAI');
    }

    const cleanedResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    try {
      return JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('Error parsing actor details response:', parseError);
      throw new Error('Error al procesar información del actor');
    }

  } catch (error) {
    console.error('Error getting actor details:', error);
    throw new Error('Error al obtener información del actor');
  }
}

export async function getSeriesAnalysis(seriesTitle, releaseYear) {
  try {
    const prompt = `
Analiza en detalle la serie de televisión "${seriesTitle}" (${releaseYear}) y proporciona información completa en formato JSON con la siguiente estructura:

{
  "cast": [
    {
      "name": "Nombre del actor",
      "character": "Personaje que interpreta",
      "biography": "Biografía breve del actor",
      "filmography": ["Serie/Película 1", "Serie/Película 2", "Serie/Película 3"]
    }
  ],
  "production": {
    "network": "Cadena o plataforma de transmisión",
    "creators": ["Creador 1", "Creador 2"],
    "producers": ["Productor 1", "Productor 2"],
    "showrunners": ["Showrunner 1", "Showrunner 2"],
    "writers": ["Guionista 1", "Guionista 2"],
    "cinematographer": "Director de fotografía",
    "composer": "Compositor de la banda sonora"
  },
  "seriesInfo": {
    "seasons": 0,
    "episodes": 0,
    "runtime": "Duración promedio por episodio",
    "status": "Estado actual (En emisión/Finalizada/Cancelada)",
    "originalRun": "Período de emisión original"
  },
  "awards": {
    "emmys": ["Premio Emmy 1", "Premio Emmy 2"],
    "goldenGlobes": ["Globo de Oro 1", "Globo de Oro 2"],
    "otherAwards": ["Otro premio 1", "Otro premio 2"]
  },
  "criticalReception": {
    "rottenTomatoes": "Puntuación en Rotten Tomatoes",
    "imdb": "Puntuación en IMDb",
    "metacritic": "Puntuación en Metacritic",
    "criticsConsensus": "Consenso de la crítica"
  },
  "culturalImpact": {
    "legacy": "Legado e impacto cultural",
    "influence": "Influencia en otras series y medios",
    "trivia": ["Dato curioso 1", "Dato curioso 2", "Dato curioso 3"]
  },
  "technicalAspects": {
    "cinematography": "Análisis de la cinematografía",
    "soundtrack": "Análisis de la banda sonora",
    "visualEffects": "Análisis de efectos visuales",
    "editing": "Análisis de la edición"
  }
}

Incluye solo los 5 actores principales del reparto. Proporciona información precisa y detallada. Responde ÚNICAMENTE con el JSON válido, sin texto adicional.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Eres un experto en análisis de series de televisión. Proporciona información precisa y detallada en formato JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 4000,
    });

    const response = completion.choices[0]?.message?.content;
    
    if (!response) {
      throw new Error('No se recibió respuesta de OpenAI');
    }

    const cleanedResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    try {
      return JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('Error parsing series analysis response:', parseError);
      throw new Error('Error al procesar análisis de la serie');
    }

  } catch (error) {
    console.error('Error getting series analysis:', error);
    throw new Error('Error al obtener análisis de la serie');
  }
}