const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export interface Movie {
    id: number;
    title?: string; // películas
    name?: string; // series
    poster_path: string | null;
    vote_average: number;
    genre_ids?: number[];
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

export async function getTrendingMovies(): Promise<{ results: Movie[] }> {
    const res = await fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}&language=es-ES`);
    if (!res.ok) throw new Error("Error al obtener películas en tendencia");
    return res.json();
}

// 🔎 Buscar Películas
export async function searchMovies(query: string): Promise<{ results: Movie[] }> {
    const res = await fetch(
        `${BASE_URL}/search/movie?api_key=${API_KEY}&language=es-ES&query=${encodeURIComponent(query)}`
    );
    if (!res.ok) throw new Error("Error al buscar películas");
    return res.json();
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

export async function getTrendingTV(): Promise<{ results: Movie[] }> {
    const res = await fetch(`${BASE_URL}/trending/tv/week?api_key=${API_KEY}&language=es-ES`);
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

