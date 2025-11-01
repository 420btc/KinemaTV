import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
    getTrendingMovies,
    getTopRatedMovies,
    getNowPlayingMovies,
    getTrendingTV,
    getTopRatedTV,
    discoverMovies,
} from "../services/tmdb";
import { FavoriteButton } from "../components/FavoriteButton";
import { WatchlistButton } from "../components/WatchlistButton";
import { CelestialSphere } from "../components/ui/celestial-sphere";
import { SeasonalCuration } from "../components/SeasonalCuration";
import type { Movie } from "../services/tmdb";

// Tipo de ref (permite null sin romper TypeScript)
type DivRef = React.MutableRefObject<HTMLDivElement | null>;

export default function Home() {
    const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
    const [trendingMoviesToday, setTrendingMoviesToday] = useState<Movie[]>([]);
    const [topRated, setTopRated] = useState<Movie[]>([]);
    const [nowPlaying, setNowPlaying] = useState<Movie[]>([]);
    const [trendingTV, setTrendingTV] = useState<Movie[]>([]);
    const [topRatedTV, setTopRatedTV] = useState<Movie[]>([]);
    const [recentMovies, setRecentMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const trendingMoviesRef = useRef<HTMLDivElement | null>(null);
    const trendingMoviesTodayRef = useRef<HTMLDivElement | null>(null);
    const topRatedRef = useRef<HTMLDivElement | null>(null);
    const nowPlayingRef = useRef<HTMLDivElement | null>(null);
    const trendingTVRef = useRef<HTMLDivElement | null>(null);
    const topRatedTVRef = useRef<HTMLDivElement | null>(null);
    const recentMoviesRef = useRef<HTMLDivElement | null>(null);

    // Función para hacer scroll lateral suave
    const scroll = (ref: DivRef, direction: "left" | "right") => {
        const el = ref.current;
        if (!el) return;
        const delta = direction === "left" ? -el.clientWidth : el.clientWidth;
        el.scrollTo({ left: el.scrollLeft + delta, behavior: "smooth" });
    };

    useEffect(() => {
        Promise.all([
            getTrendingMovies('week'),
            getTrendingMovies('day'),
            getTopRatedMovies(),
            getNowPlayingMovies(),
            getTrendingTV('week'),
            getTopRatedTV(),
            discoverMovies({ sortBy: 'release_date.desc', year: new Date().getFullYear() })
        ])
            .then(([trendWeek, trendDay, top, now, tvTrend, tvTop, recent]) => {
                setTrendingMovies(trendWeek.results);
                setTrendingMoviesToday(trendDay.results);
                setTopRated(top.results);
                setNowPlaying(now.results);
                setTrendingTV(tvTrend.results);
                setTopRatedTV(tvTop.results);
                setRecentMovies(recent.results);
            })
            .catch(() => setError("Error al cargar contenido"))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p className="p-4 text-gray-400">Cargando películas...</p>;
    if (error) return <p className="p-4 text-red-500">{error}</p>;

    // --- Sección reutilizable ---
    const Section = ({
        title,
        movies,
        refEl,
        isTV = false,
    }: {
        title: string;
        movies: Movie[];
        refEl: DivRef;
        isTV?: boolean;
    }) => (
        <section className="relative mb-14 animate-fadeIn">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl md:text-2xl font-bold text-kinematv-yellow tracking-wide">
                    {title}
                </h2>
            </div>

            <div className="relative group">
                {/* Carrusel */}
                <div
                    ref={refEl}
                    className="flex gap-4 overflow-x-auto pb-4 scroll-smooth custom-scroll"
                    style={{
                        maskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
                        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)'
                    }}
                >
                    {movies.map((movie) => (
                        <div
                            key={movie.id}
                            className="min-w-[160px] sm:min-w-[180px] md:min-w-[200px] bg-[#101523] rounded-lg overflow-hidden shadow-md hover:scale-105 transition-transform duration-300 flex-shrink-0 relative group"
                            style={{ height: "310px" }}
                        >
                            <Link to={isTV ? `/tv/${movie.id}` : `/movie/${movie.id}`} className="block">
                                {movie.poster_path ? (
                                    <img
                                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                        alt={movie.title || movie.name}
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
                                        {movie.title || movie.name}
                                    </h3>
                                    <p className="text-kinematv-yellow text-xs mt-1">
                                        ⭐ {movie.vote_average.toFixed(1)}
                                    </p>
                                </div>
                            </Link>
                            
                            {/* Botones de favoritos y watchlist */}
                            <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <FavoriteButton movie={movie} />
                                <WatchlistButton movie={movie} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Botones de navegación glass */}
                <button
                    onClick={() => scroll(refEl, "left")}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 hover:border-kinematv-yellow/50 text-kinematv-yellow opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl z-10"
                    aria-label="Deslizar a la izquierda"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
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
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 hover:border-kinematv-yellow/50 text-kinematv-yellow opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl z-10"
                    aria-label="Deslizar a la derecha"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
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
        <div className="relative min-h-screen">
            {/* Shader de fondo */}
            <CelestialSphere
                hue={10}
                speed={0.9}
                zoom={1.8}
                particleSize={2.5}
                className="fixed top-0 left-0 w-full h-full z-0"
            />
            
            {/* Contenido principal */}
            <div className="relative z-10 px-2 sm:px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
                <Section
                    title="🔥 Tendencia esta semana"
                    movies={trendingMovies}
                    refEl={trendingMoviesRef}
                />
                <Section
                    title="⚡ Tendencia hoy"
                    movies={trendingMoviesToday}
                    refEl={trendingMoviesTodayRef}
                />
                
                {/* Seasonal Curation */}
                <SeasonalCuration className="my-12" />
                
                <Section 
                    title="🎬 En cines ahora" 
                    movies={nowPlaying} 
                    refEl={nowPlayingRef} 
                />
                <Section 
                    title="⭐ Mejor valoradas" 
                    movies={topRated} 
                    refEl={topRatedRef} 
                />
                <Section 
                    title="🆕 Estrenos recientes 2024" 
                    movies={recentMovies} 
                    refEl={recentMoviesRef} 
                />
                <Section
                    title="📺 Series en tendencia"
                    movies={trendingTV}
                    refEl={trendingTVRef}
                    isTV={true}
                />
                <Section
                    title="⭐ Series mejor valoradas"
                    movies={topRatedTV}
                    refEl={topRatedTVRef}
                    isTV={true}
                />
            </div>
        </div>
    );
}
