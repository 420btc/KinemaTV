import type { MovieAnalysis, ActorDetails, SeriesAnalysis } from '../api/openai';

const API_BASE_URL = 'http://localhost:3001/api';

export async function fetchSeriesAnalysis(
  seriesTitle: string,
  seriesYear?: number,
  seriesGenres?: string[]
): Promise<SeriesAnalysis> {
  try {
    const response = await fetch(`${API_BASE_URL}/series-analysis`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        seriesTitle,
        seriesYear,
        seriesGenres,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching series analysis:', error);
    throw error;
  }
}

export async function fetchMovieAnalysis(
  movieTitle: string,
  movieYear?: number,
  movieGenres?: string[]
): Promise<MovieAnalysis> {
  try {
    const response = await fetch(`${API_BASE_URL}/movie-analysis`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        movieTitle,
        movieYear,
        movieGenres,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching movie analysis:', error);
    throw error;
  }
}

export async function fetchActorDetails(actorName: string): Promise<ActorDetails> {
  try {
    const response = await fetch(`${API_BASE_URL}/actor-details`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        actorName,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching actor details:', error);
    throw error;
  }
}