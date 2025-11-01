import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
    getTrendingMovies,
    getTopRatedMovies,
    getPopularMovies,
} from "../services/tmdb";
import type { Movie } from "../services/tmdb";

// Tipo de ref (permite null sin romper TypeScript)
type DivRef = React.MutableRefObject<HTMLDivElement | null>;

export default function Home() {
    const [trending, setTrending] = useState<Movie[]>([]);
    const [topRated, setTopRated] = useState<Movie[]>([]);
    const [popular, setPopular] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const trendingRef = useRef<HTMLDivElement | null>(null);
    const topRatedRef = useRef<HTMLDivElement | null>(null);
    const popularRef = useRef<HTMLDivElement | null>(null);

    // Función para hacer scroll lateral suave
    const scroll = (ref: DivRef, direction: "left" | "right") => {
        const el = ref.current;
        if (!el) return;
        const delta = direction === "left" ? -el.clientWidth : el.clientWidth;
        el.scrollTo({ left: el.scrollLeft + delta, behavior: "smooth" });
    };

    useEffect(() => {
        Promise.all([getTrendingMovies(), getTopRatedMovies(), getPopularMovies()])
            .then(([t, top, pop]) => {
                setTrending(t.results);
                setTopRated(top.results);
                setPopular(pop.results);
            })
            .catch(() => setError("Error al cargar películas"))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p className="p-4 text-gray-400">Cargando películas...</p>;
    if (error) return <p className="p-4 text-red-500">{error}</p>;

    // --- Sección reutilizable ---
    const Section = ({
        title,
        movies,
        refEl,
    }: {
        title: string;
        movies: Movie[];
        refEl: DivRef;
    }) => (
        <section className="relative mb-14 animate-fadeIn">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl md:text-2xl font-bold text-scenra-yellow tracking-wide">
                    {title}
                </h2>
            </div>

            <div className="relative group">
                {/* Carrusel */}
                <div
                    ref={refEl}
                    className="flex gap-4 overflow-x-auto pb-4 scroll-smooth custom-scroll"
                >
                    {movies.map((movie) => (
                        <Link
                            to={`/movie/${movie.id}`}
                            key={movie.id}
                            className="min-w-[160px] sm:min-w-[180px] md:min-w-[200px] bg-[#101523] rounded-lg overflow-hidden shadow-md hover:shadow-glow hover:scale-105 transition-transform duration-300 flex-shrink-0"
                            style={{ height: "310px" }}
                        >
                            {movie.poster_path ? (
                                <img
                                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                    alt={movie.title}
                                    className="w-full h-[250px] object-cover"
                                    loading="lazy"
                                />
                            ) : (
                                <div className="h-[250px] flex items-center justify-center text-gray-500 bg-[#1E2533]">
                                    Sin imagen
                                </div>
                            )}
                            <div className="p-2">
                                <h3 className="text-sm font-semibold truncate w-full">
                                    {movie.title}
                                </h3>
                                <p className="text-scenra-yellow text-xs mt-1">
                                    ⭐ {movie.vote_average.toFixed(1)}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* 🔘 Flechas visibles solo en desktop */}
                <button
                    onClick={() => scroll(refEl, "left")}
                    className="hidden sm:flex absolute left-0 top-0 bottom-0 w-10 md:w-12 items-center justify-center bg-gradient-to-r from-[#0a0e1a]/80 to-transparent text-scenra-yellow opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    aria-label="Deslizar a la izquierda"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                </button>

                <button
                    onClick={() => scroll(refEl, "right")}
                    className="hidden sm:flex absolute right-0 top-0 bottom-0 w-10 md:w-12 items-center justify-center bg-gradient-to-l from-[#0a0e1a]/80 to-transparent text-scenra-yellow opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    aria-label="Deslizar a la derecha"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                </button>
            </div>
        </section>
    );


    // --- Página ---
    return (
        <div className="px-2 sm:px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
            <Section
                title="En tendencia esta semana"
                movies={trending}
                refEl={trendingRef}
            />
            <Section title="Más valoradas" movies={topRated} refEl={topRatedRef} />
            <Section title="Populares" movies={popular} refEl={popularRef} />
        </div>
    );
}
