const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export interface Movie {
    id: number;
    title?: string; // películas
    name?: string; // series
    poster_path: string | null;
    vote_average: number;
    genre_ids?: number[];
    release_date?: string; // fecha de lanzamiento para películas
    first_air_date?: string; // fecha de lanzamiento para series
}

export interface Actor {
    id: number;
    name: string;
    profile_path: string | null;
    popularity: number;
    known_for_department: string;
    known_for: Movie[];
    gender: number; // 1 = femenino, 2 = masculino
    adult: boolean;
}

// 🎬 --- PELÍCULAS ---
export async function getPopularMovies(): Promise<{ results: Movie[] }> {
    const res = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=es-ES&page=1`);
    if (!res.ok) throw new Error("Error al obtener películas populares");
    return res.json();
}

export async function getTopRatedMovies(): Promise<{ results: Movie[] }> {
    const res = await fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=es-ES&page=1`);
    if (!res.ok) throw new Error("Error al obtener películas mejor valoradas");
    return res.json();
}

export async function getTrendingMovies(timeWindow: 'day' | 'week' = 'week'): Promise<{ results: Movie[] }> {
    const res = await fetch(`${BASE_URL}/trending/movie/${timeWindow}?api_key=${API_KEY}&language=es-ES`);
    if (!res.ok) throw new Error("Error al obtener películas en tendencia");
    return res.json();
}

// 🔎 Buscar Películas
export async function searchMovies(
    query: string, 
    year?: number, 
    minRating?: number, 
    maxRating?: number
): Promise<{ results: Movie[] }> {
    let url = `${BASE_URL}/search/movie?api_key=${API_KEY}&language=es-ES&query=${encodeURIComponent(query)}`;
    
    if (year) {
        url += `&primary_release_year=${year}`;
    }
    
    const res = await fetch(url);
    if (!res.ok) throw new Error("Error al buscar películas");
    const data = await res.json();
    
    // Filtrar por puntuación si se especifica
    if (minRating !== undefined || maxRating !== undefined) {
        data.results = data.results.filter((movie: Movie) => {
            const rating = movie.vote_average;
            const meetsMin = minRating === undefined || rating >= minRating;
            const meetsMax = maxRating === undefined || rating <= maxRating;
            return meetsMin && meetsMax;
        });
    }
    
    return data;
}

// 🧩 Detalles con créditos y videos
export async function getMovieDetails(id: string) {
    const res = await fetch(
        `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=es-ES&append_to_response=credits,videos`
    );
    if (!res.ok) throw new Error("Error al obtener detalles de la película");
    return res.json();
}

// 📺 --- SERIES ---
export async function getPopularTV(): Promise<{ results: Movie[] }> {
    const res = await fetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}&language=es-ES&page=1`);
    if (!res.ok) throw new Error("Error al obtener series populares");
    return res.json();
}

export async function getTopRatedTV(): Promise<{ results: Movie[] }> {
    const res = await fetch(`${BASE_URL}/tv/top_rated?api_key=${API_KEY}&language=es-ES&page=1`);
    if (!res.ok) throw new Error("Error al obtener series mejor valoradas");
    return res.json();
}

export async function getTrendingTV(timeWindow: 'day' | 'week' = 'week'): Promise<{ results: Movie[] }> {
    const res = await fetch(`${BASE_URL}/trending/tv/${timeWindow}?api_key=${API_KEY}&language=es-ES`);
    if (!res.ok) throw new Error("Error al obtener series en tendencia");
    return res.json();
}

// 🔎 Buscar Series
export async function searchTV(query: string): Promise<{ results: Movie[] }> {
    const res = await fetch(
        `${BASE_URL}/search/tv?api_key=${API_KEY}&language=es-ES&query=${encodeURIComponent(query)}`
    );
    if (!res.ok) throw new Error("Error al buscar series");
    return res.json();
}

// Detalles de series (con créditos y videos)
export async function getTVDetails(id: string) {
    const res = await fetch(
        `${BASE_URL}/tv/${id}?api_key=${API_KEY}&language=es-ES&append_to_response=credits,videos`
    );
    if (!res.ok) {
        throw new Error("Error al obtener detalles de la serie");
    }
    return res.json();
}

// 👥 --- ACTORES ---
// 🔎 Buscar Actores
export async function searchActors(query: string): Promise<{ results: Actor[] }> {
    const res = await fetch(
        `${BASE_URL}/search/person?api_key=${API_KEY}&language=es-ES&query=${encodeURIComponent(query)}`
    );
    if (!res.ok) throw new Error("Error al buscar actores");
    return res.json();
}

// 🎭 Obtener actores populares
export async function getPopularActors(): Promise<{ results: Actor[] }> {
    const res = await fetch(`${BASE_URL}/person/popular?api_key=${API_KEY}&language=es-ES&page=1`);
    if (!res.ok) throw new Error("Error al obtener actores populares");
    return res.json();
}

// 📋 Detalles completos del actor
export async function getActorDetails(id: string) {
    const res = await fetch(
        `${BASE_URL}/person/${id}?api_key=${API_KEY}&language=es-ES&append_to_response=movie_credits,tv_credits,images`
    );
    if (!res.ok) throw new Error("Error al obtener detalles del actor");
    return res.json();
}

// 🎬 Filmografía del actor (solo películas)
export async function getActorMovieCredits(id: string) {
    const res = await fetch(
        `${BASE_URL}/person/${id}/movie_credits?api_key=${API_KEY}&language=es-ES`
    );
    if (!res.ok) throw new Error("Error al obtener filmografía del actor");
    return res.json();
}

// 📺 Filmografía del actor (solo series)
export async function getActorTVCredits(id: string) {
    const res = await fetch(`${BASE_URL}/person/${id}/tv_credits?api_key=${API_KEY}&language=es-ES`);
    if (!res.ok) throw new Error("Error al obtener créditos de TV del actor");
    return res.json();
}

// 🆕 --- FUNCIONES ADICIONALES ---

// Películas que se estrenan próximamente
export async function getUpcomingMovies(): Promise<{ results: Movie[] }> {
    const res = await fetch(`${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=es-ES&page=1`);
    if (!res.ok) throw new Error("Error al obtener próximos estrenos");
    return res.json();
}

// Películas que están en cines ahora
export async function getNowPlayingMovies(): Promise<{ results: Movie[] }> {
    const res = await fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=es-ES&page=1`);
    if (!res.ok) throw new Error("Error al obtener películas en cines");
    return res.json();
}

// Series que se emiten hoy
export async function getTVAiringToday(): Promise<{ results: Movie[] }> {
    const res = await fetch(`${BASE_URL}/tv/airing_today?api_key=${API_KEY}&language=es-ES&page=1`);
    if (!res.ok) throw new Error("Error al obtener series de hoy");
    return res.json();
}

// Series que se emiten esta semana
export async function getTVOnTheAir(): Promise<{ results: Movie[] }> {
    const res = await fetch(`${BASE_URL}/tv/on_the_air?api_key=${API_KEY}&language=es-ES&page=1`);
    if (!res.ok) throw new Error("Error al obtener series de esta semana");
    return res.json();
}

// Descubrir películas con filtros personalizados
export async function discoverMovies(params: {
    sortBy?: 'popularity.desc' | 'vote_average.desc' | 'release_date.desc' | 'revenue.desc';
    year?: number;
    genreIds?: number[];
    minVoteAverage?: number;
    page?: number;
}): Promise<{ results: Movie[] }> {
    const { sortBy = 'popularity.desc', year, genreIds, minVoteAverage, page = 1 } = params;
    
    let url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=es-ES&page=${page}&sort_by=${sortBy}`;
    
    if (year) url += `&primary_release_year=${year}`;
    if (genreIds && genreIds.length > 0) url += `&with_genres=${genreIds.join(',')}`;
    if (minVoteAverage) url += `&vote_average.gte=${minVoteAverage}`;
    
    const res = await fetch(url);
    if (!res.ok) throw new Error("Error al descubrir películas");
    return res.json();
}

// Descubrir series con filtros personalizados
export async function discoverTV(params: {
    sortBy?: 'popularity.desc' | 'vote_average.desc' | 'first_air_date.desc';
    year?: number;
    genreIds?: number[];
    minVoteAverage?: number;
    page?: number;
}): Promise<{ results: Movie[] }> {
    const { sortBy = 'popularity.desc', year, genreIds, minVoteAverage, page = 1 } = params;
    
    let url = `${BASE_URL}/discover/tv?api_key=${API_KEY}&language=es-ES&page=${page}&sort_by=${sortBy}`;
    
    if (year) url += `&first_air_date_year=${year}`;
    if (genreIds && genreIds.length > 0) url += `&with_genres=${genreIds.join(',')}`;
    if (minVoteAverage) url += `&vote_average.gte=${minVoteAverage}`;
    
    const res = await fetch(url);
    if (!res.ok) throw new Error("Error al descubrir series");
    return res.json();
}

