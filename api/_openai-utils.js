// Utilidades de OpenAI para funciones serverless de Vercel

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

if (!OPENAI_API_KEY) {
  console.error('OPENAI_API_KEY no está configurada');
}

async function makeOpenAIRequest(messages, maxTokens = 4000) {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key no configurada');
  }

  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: messages,
      max_tokens: maxTokens,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`OpenAI API error: ${response.status} - ${errorData}`);
  }

  const data = await response.json();
  
  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    throw new Error('Respuesta inválida de OpenAI API');
  }

  return data.choices[0].message.content;
}

export async function getMovieAnalysis(movieTitle, releaseYear) {
  const prompt = `Analiza la película "${movieTitle}" (${releaseYear}) y proporciona un análisis detallado en formato JSON con la siguiente estructura exacta:

{
  "title": "${movieTitle}",
  "releaseYear": ${releaseYear},
  "cast": [
    {
      "name": "Nombre del actor",
      "character": "Nombre del personaje",
      "role": "main" | "supporting"
    }
  ],
  "boxOffice": {
    "budget": "Presupuesto en USD",
    "worldwide": "Recaudación mundial en USD",
    "domestic": "Recaudación doméstica en USD",
    "international": "Recaudación internacional en USD"
  },
  "production": {
    "director": "Nombre del director",
    "producers": ["Lista de productores"],
    "writers": ["Lista de guionistas"],
    "studio": "Estudio de producción",
    "distributors": ["Lista de distribuidores"]
  },
  "awards": {
    "oscars": {
      "nominations": 0,
      "wins": 0,
      "categories": ["Lista de categorías"]
    },
    "goldenGlobes": {
      "nominations": 0,
      "wins": 0,
      "categories": ["Lista de categorías"]
    },
    "otherAwards": ["Lista de otros premios importantes"]
  },
  "criticalReception": {
    "rottenTomatoes": {
      "criticsScore": 0,
      "audienceScore": 0
    },
    "imdb": {
      "rating": 0.0,
      "votes": 0
    },
    "metacritic": {
      "score": 0
    }
  },
  "culturalImpact": {
    "significance": "Descripción del impacto cultural",
    "legacy": "Descripción del legado",
    "influence": "Descripción de la influencia en el cine"
  },
  "technicalAspects": {
    "cinematography": "Descripción de la cinematografía",
    "soundtrack": "Información sobre la banda sonora",
    "visualEffects": "Descripción de los efectos visuales",
    "editing": "Información sobre la edición"
  }
}

Proporciona solo el JSON válido, sin texto adicional.`;

  const messages = [
    {
      role: 'system',
      content: 'Eres un experto analista de cine. Proporciona análisis detallados y precisos de películas en formato JSON.'
    },
    {
      role: 'user',
      content: prompt
    }
  ];

  try {
    const content = await makeOpenAIRequest(messages);
    return JSON.parse(content);
  } catch (error) {
    console.error('Error en getMovieAnalysis:', error);
    throw error;
  }
}

export async function getSeriesAnalysis(seriesTitle, releaseYear) {
  const prompt = `Analiza la serie "${seriesTitle}" (${releaseYear}) y proporciona un análisis detallado en formato JSON con la siguiente estructura exacta:

{
  "title": "${seriesTitle}",
  "releaseYear": ${releaseYear},
  "seasons": 0,
  "episodes": 0,
  "status": "Ended" | "Ongoing" | "Cancelled",
  "cast": [
    {
      "name": "Nombre del actor",
      "character": "Nombre del personaje",
      "role": "main" | "supporting",
      "seasons": [1, 2, 3]
    }
  ],
  "production": {
    "creators": ["Lista de creadores"],
    "executiveProducers": ["Lista de productores ejecutivos"],
    "network": "Cadena o plataforma original",
    "distributors": ["Lista de distribuidores"],
    "productionCompanies": ["Lista de compañías de producción"]
  },
  "awards": {
    "emmys": {
      "nominations": 0,
      "wins": 0,
      "categories": ["Lista de categorías"]
    },
    "goldenGlobes": {
      "nominations": 0,
      "wins": 0,
      "categories": ["Lista de categorías"]
    },
    "otherAwards": ["Lista de otros premios importantes"]
  },
  "criticalReception": {
    "imdb": {
      "rating": 0.0,
      "votes": 0
    },
    "rottenTomatoes": {
      "criticsScore": 0,
      "audienceScore": 0
    },
    "metacritic": {
      "score": 0
    }
  },
  "culturalImpact": {
    "significance": "Descripción del impacto cultural",
    "legacy": "Descripción del legado",
    "influence": "Descripción de la influencia en la televisión"
  },
  "technicalAspects": {
    "cinematography": "Descripción de la cinematografía",
    "soundtrack": "Información sobre la banda sonora",
    "visualEffects": "Descripción de los efectos visuales",
    "writing": "Información sobre la escritura y narrativa"
  }
}

Proporciona solo el JSON válido, sin texto adicional.`;

  const messages = [
    {
      role: 'system',
      content: 'Eres un experto analista de televisión. Proporciona análisis detallados y precisos de series en formato JSON.'
    },
    {
      role: 'user',
      content: prompt
    }
  ];

  try {
    const content = await makeOpenAIRequest(messages);
    return JSON.parse(content);
  } catch (error) {
    console.error('Error en getSeriesAnalysis:', error);
    throw error;
  }
}

export async function getActorDetails(actorName) {
  const prompt = `Proporciona información detallada sobre el actor "${actorName}" en formato JSON con la siguiente estructura exacta:

{
  "name": "${actorName}",
  "birthDate": "YYYY-MM-DD",
  "birthPlace": "Ciudad, País",
  "nationality": "Nacionalidad",
  "biography": "Biografía detallada del actor",
  "careerStart": 0000,
  "filmography": [
    {
      "title": "Título de la película/serie",
      "year": 0000,
      "role": "Nombre del personaje",
      "type": "movie" | "tv_series",
      "genre": "Género principal"
    }
  ],
  "awards": {
    "oscars": {
      "nominations": 0,
      "wins": 0,
      "categories": ["Lista de categorías"]
    },
    "goldenGlobes": {
      "nominations": 0,
      "wins": 0,
      "categories": ["Lista de categorías"]
    },
    "emmys": {
      "nominations": 0,
      "wins": 0,
      "categories": ["Lista de categorías"]
    },
    "otherAwards": ["Lista de otros premios importantes"]
  },
  "personalLife": {
    "spouse": "Nombre del cónyuge (si aplica)",
    "children": 0,
    "education": "Información educativa",
    "interests": ["Lista de intereses personales"]
  },
  "careerHighlights": [
    "Lista de momentos destacados de la carrera"
  ],
  "socialImpact": {
    "activism": "Información sobre activismo",
    "philanthropy": "Información sobre filantropía",
    "publicImage": "Descripción de la imagen pública"
  }
}

Proporciona solo el JSON válido, sin texto adicional.`;

  const messages = [
    {
      role: 'system',
      content: 'Eres un experto en biografías de celebridades. Proporciona información detallada y precisa sobre actores en formato JSON.'
    },
    {
      role: 'user',
      content: prompt
    }
  ];

  try {
    const content = await makeOpenAIRequest(messages);
    return JSON.parse(content);
  } catch (error) {
    console.error('Error en getActorDetails:', error);
    throw error;
  }
}