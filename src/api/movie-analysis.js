// API endpoint para análisis de películas con OpenAI
// Este archivo maneja las consultas del lado del servidor para mantener la API key segura

import { getMovieAnalysis, getActorDetails, getSeriesAnalysis } from './openai.js';

// Función para manejar análisis completo de películas
export async function handleMovieAnalysis(request) {
  try {
    const { movieTitle, releaseYear } = request;
    
    if (!movieTitle || !releaseYear) {
      throw new Error('Título de película y año de lanzamiento son requeridos');
    }

    const analysis = await getMovieAnalysis(movieTitle, releaseYear);
    return analysis;
  } catch (error) {
    console.error('Error in handleMovieAnalysis:', error);
    throw error;
  }
}

// Función para manejar análisis completo de series
export async function handleSeriesAnalysis(request) {
  try {
    const { seriesTitle, releaseYear } = request;
    
    if (!seriesTitle || !releaseYear) {
      throw new Error('Título de serie y año de lanzamiento son requeridos');
    }

    const analysis = await getSeriesAnalysis(seriesTitle, releaseYear);
    return analysis;
  } catch (error) {
    console.error('Error in handleSeriesAnalysis:', error);
    throw error;
  }
}

// Función para manejar detalles de actores
export async function handleActorDetails(actorName) {
  try {
    if (!actorName) {
      throw new Error('Nombre del actor es requerido');
    }

    const details = await getActorDetails(actorName);
    return details;
  } catch (error) {
    console.error('Error in handleActorDetails:', error);
    throw error;
  }
}

// Función para validar que la API key de OpenAI esté configurada
export function validateOpenAIConfig() {
  return !!process.env.OPENAI_API_KEY;
}

// Función para obtener información básica de configuración
export function getConfigStatus() {
  return {
    openaiConfigured: validateOpenAIConfig(),
    environment: process.env.NODE_ENV || 'development'
  };
}