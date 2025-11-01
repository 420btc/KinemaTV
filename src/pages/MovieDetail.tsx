import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getMovieDetails } from "../services/tmdb";
import { FavoriteButton } from "../components/FavoriteButton";
import { WatchlistButton } from "../components/WatchlistButton";
import { SendToChatButton } from "../components/SendToChatButton";
import { CelestialSphere } from "../components/ui/celestial-sphere";
import { fetchMovieAnalysis, fetchActorDetails } from "../services/movieAnalysis";
import CommentsSection from "../components/CommentsSection";
import type { MovieAnalysis, ActorDetails } from "../api/openai";
import type { FC } from "react";

interface MovieDetails {
    id: number;
    title: string;
    overview: string;
    poster_path?: string | null;
    release_date?: string;
    vote_average: number;
    genres: { id: number; name: string }[];
    credits?: {
        cast: { id: number; name: string; profile_path: string | null }[];
    };
    videos?: {
        results: { key: string; type: string; site: string }[];
    };
}

const MovieDetail: FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [movie, setMovie] = useState<MovieDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Estados para análisis avanzado
    const [movieAnalysis, setMovieAnalysis] = useState<MovieAnalysis | null>(null);
    const [analysisLoading, setAnalysisLoading] = useState(false);
    const [analysisError, setAnalysisError] = useState<string | null>(null);
    const [showAnalysis, setShowAnalysis] = useState(false);
    const [selectedActor, setSelectedActor] = useState<string | null>(null);
    const [actorDetails, setActorDetails] = useState<ActorDetails | null>(null);
    const [actorLoading, setActorLoading] = useState(false);

    // 🔹 Detectar si estamos en película o serie según la ruta
    const isTV = window.location.pathname.includes("/tv/");

    useEffect(() => {
        if (!id) return;
        getMovieDetails(id)
            .then((data) => {
                setMovie(data);
                setLoading(false);
            })
            .catch(() => {
                setError("Error cargando detalles de la película");
                setLoading(false);
            });
    }, [id]);

    const handleBack = () => {
        navigate(`/explore?type=${isTV ? "tv" : "movie"}`);
    };

    // Función para obtener análisis avanzado
    const handleGetAnalysis = async () => {
        if (!movie) return;
        
        setAnalysisLoading(true);
        setAnalysisError(null);
        
        try {
            const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : undefined;
            const genres = movie.genres?.map(g => g.name);
            const analysis = await fetchMovieAnalysis(movie.title, releaseYear, genres);
            
            setMovieAnalysis(analysis);
            setShowAnalysis(true);
        } catch (error) {
            setAnalysisError('Error al conectar con el servicio de análisis');
            console.error('Analysis error:', error);
        } finally {
            setAnalysisLoading(false);
        }
    };

    // Función para obtener detalles de actor
    const handleActorClick = async (actorName: string) => {
        setSelectedActor(actorName);
        setActorLoading(true);
        
        try {
            const details = await fetchActorDetails(actorName);
            setActorDetails(details);
        } catch (error) {
            console.error('Error fetching actor details:', error);
            setActorDetails(null);
        } finally {
            setActorLoading(false);
        }
    };

    if (loading)
        return <p className="p-4 text-center text-gray-400">Cargando...</p>;
    if (error)
        return (
            <p className="p-4 text-center text-red-500 font-semibold">{error}</p>
        );
    if (!movie) return null;

    const trailer = movie.videos?.results.find(
        (v) => v.type === "Trailer" && v.site === "YouTube"
    );

    return (
        <div className="relative min-h-screen">
            {/* Shader de fondo */}
            <CelestialSphere
                hue={11}
                speed={0.9}
                zoom={1.8}
                particleSize={2.5}
                className="fixed top-0 left-0 w-full h-full z-0"
            />
            
            {/* Contenido principal */}
            <div className="relative z-10 max-w-6xl mx-auto p-4 sm:p-6 flex flex-col md:flex-row gap-8 animate-fadeIn">
            {/* 🎬 Poster */}
            {movie.poster_path && (
                <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="w-56 h-80 object-cover rounded-xl shadow-glow flex-shrink-0"
                />
            )}

            {/* 📄 Información principal */}
            <div className="flex-1 overflow-hidden">
                <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                    {movie.title}
                </h2>

                {/* 🔹 Línea de metadatos + botón volver */}
                <div className="flex justify-between items-center mb-3 flex-wrap gap-3">
                    <div className="flex items-center gap-4">
                        <p className="text-gray-400">
                            ⭐ {movie.vote_average.toFixed(1)} | {movie.release_date}
                        </p>
                        
                        {/* Botones de favoritos y watchlist */}
                        <div className="flex gap-2">
                            <FavoriteButton movie={movie} />
                            <WatchlistButton movie={movie} />
                            <SendToChatButton movie={movie} type="movie" />
                        </div>
                    </div>

                    {/* 🔙 Botón "Volver" (alineado al texto, flecha izquierda) */}
                    <motion.button
                        onClick={handleBack}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full
                            bg-[#0f172a]/80 backdrop-blur-md border border-gray-700/50 text-gray-300 
                            hover:text-yellow-400 hover:border-yellow-400 transition-all shadow-md"
                        whileHover={{
                            scale: 1.05,
                            boxShadow: "0 0 10px rgba(250,204,21,0.4)",
                        }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span className="text-lg">←</span>
                        <span className="font-medium text-sm">Volver</span>
                    </motion.button>
                </div>

                <p className="mb-4 text-gray-200 leading-relaxed">{movie.overview}</p>

                {/* 🎭 Géneros */}
                {movie.genres?.length > 0 && (
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-yellow-400 mb-1">
                            Géneros
                        </h3>
                        <p className="text-gray-300">
                            {movie.genres.map((g) => g.name).join(", ")}
                        </p>
                    </div>
                )}

                {/* 🎬 Tráiler */}
                {trailer && (
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-yellow-400 mb-2">
                            Tráiler
                        </h3>
                        <iframe
                            className="w-full md:w-[500px] h-64 rounded-lg shadow-md"
                            src={`https://www.youtube.com/embed/${trailer.key}`}
                            title="Trailer"
                            allowFullScreen
                        ></iframe>
                    </div>
                )}

                {/* 👥 Reparto */}
                {movie.credits?.cast?.length ? (
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-yellow-400 mb-3">
                            Reparto principal
                        </h3>
                        <div className="flex gap-4 overflow-x-auto pb-2 pr-2 scrollbar-thin scrollbar-thumb-yellow-400/50 scrollbar-track-transparent">
                            {movie.credits.cast.slice(0, 10).map((actor) => (
                                <div
                                    key={actor.id}
                                    className="w-24 text-center flex-shrink-0 bg-[#1a1f2e] rounded-lg p-2 cursor-pointer hover:bg-[#252b3d] transition-colors"
                                    onClick={() => handleActorClick(actor.name)}
                                >
                                    {actor.profile_path ? (
                                        <img
                                            src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                                            alt={actor.name}
                                            className="rounded-lg mb-1"
                                        />
                                    ) : (
                                        <div className="h-32 bg-gray-700 flex items-center justify-center text-gray-400 rounded">
                                            Sin foto
                                        </div>
                                    )}
                                    <p className="text-xs truncate">{actor.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : null}

                {/* 🔍 Análisis Avanzado */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-yellow-400">
                            Análisis Avanzado
                        </h3>
                        <button
                            onClick={handleGetAnalysis}
                            disabled={analysisLoading}
                            className="px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {analysisLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent"></div>
                                    Analizando...
                                </>
                            ) : (
                                <>
                                    🧠 Obtener Análisis
                                </>
                            )}
                        </button>
                    </div>
                    
                    {analysisError && (
                        <div className="bg-red-900/50 border border-red-500 rounded-lg p-4 mb-4">
                            <p className="text-red-300">{analysisError}</p>
                        </div>
                    )}
                </div>

                {/* 📊 Sección de Análisis Avanzado */}
                {showAnalysis && movieAnalysis && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-8 bg-gradient-to-br from-[#1a1f2e] to-[#252b3d] rounded-xl p-6 border border-purple-500/20"
                    >
                        <h3 className="text-2xl font-bold text-purple-400 mb-6 flex items-center gap-2">
                            🤖 Análisis Avanzado
                        </h3>

                        {/* Taquilla */}
                        <div className="mb-6">
                            <h4 className="text-lg font-semibold text-yellow-400 mb-3">💰 Taquilla</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="bg-[#0f172a] p-3 rounded-lg">
                                    <p className="text-gray-400 text-sm">Presupuesto</p>
                                    <p className="text-white font-semibold">{movieAnalysis.boxOffice.budget}</p>
                                </div>
                                <div className="bg-[#0f172a] p-3 rounded-lg">
                                    <p className="text-gray-400 text-sm">Mundial</p>
                                    <p className="text-white font-semibold">{movieAnalysis.boxOffice.worldwide}</p>
                                </div>
                                <div className="bg-[#0f172a] p-3 rounded-lg">
                                    <p className="text-gray-400 text-sm">Doméstica</p>
                                    <p className="text-white font-semibold">{movieAnalysis.boxOffice.domestic}</p>
                                </div>
                                <div className="bg-[#0f172a] p-3 rounded-lg">
                                    <p className="text-gray-400 text-sm">Internacional</p>
                                    <p className="text-white font-semibold">{movieAnalysis.boxOffice.international}</p>
                                </div>
                            </div>
                            <p className="text-gray-300 mt-3">{movieAnalysis.boxOffice.profitability}</p>
                        </div>

                        {/* Reparto Detallado */}
                        <div className="mb-6">
                            <h4 className="text-lg font-semibold text-yellow-400 mb-3">🎭 Reparto Detallado</h4>
                            <div className="space-y-4">
                                {movieAnalysis.cast.slice(0, 5).map((actor, index) => (
                                    <div key={index} className="bg-[#0f172a] p-4 rounded-lg">
                                        <div className="flex justify-between items-start mb-2">
                                            <h5 className="font-semibold text-white">{actor.name}</h5>
                                            <span className="text-gray-400 text-sm">como {actor.character}</span>
                                        </div>
                                        <p className="text-gray-300 text-sm mb-2">{actor.biography}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {actor.filmography.slice(0, 3).map((film, filmIndex) => (
                                                <span key={filmIndex} className="bg-purple-600/20 text-purple-300 px-2 py-1 rounded text-xs">
                                                    {film}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Producción */}
                        <div className="mb-6">
                            <h4 className="text-lg font-semibold text-yellow-400 mb-3">🎬 Producción</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-[#0f172a] p-3 rounded-lg">
                                    <p className="text-gray-400 text-sm">Estudio</p>
                                    <p className="text-white">{movieAnalysis.production.studio}</p>
                                </div>
                                <div className="bg-[#0f172a] p-3 rounded-lg">
                                    <p className="text-gray-400 text-sm">Director</p>
                                    <p className="text-white">{movieAnalysis.production.director}</p>
                                </div>
                                <div className="bg-[#0f172a] p-3 rounded-lg">
                                    <p className="text-gray-400 text-sm">Productores</p>
                                    <p className="text-white">{movieAnalysis.production.producers.join(', ')}</p>
                                </div>
                                <div className="bg-[#0f172a] p-3 rounded-lg">
                                    <p className="text-gray-400 text-sm">Guionistas</p>
                                    <p className="text-white">{movieAnalysis.production.writers.join(', ')}</p>
                                </div>
                            </div>
                        </div>

                        {/* Recepción Crítica */}
                        <div className="mb-6">
                            <h4 className="text-lg font-semibold text-yellow-400 mb-3">⭐ Recepción Crítica</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                                <div className="bg-[#0f172a] p-3 rounded-lg text-center">
                                    <p className="text-gray-400 text-sm">Rotten Tomatoes</p>
                                    <p className="text-white font-semibold">{movieAnalysis.criticalReception.rottenTomatoes}</p>
                                </div>
                                <div className="bg-[#0f172a] p-3 rounded-lg text-center">
                                    <p className="text-gray-400 text-sm">IMDb</p>
                                    <p className="text-white font-semibold">{movieAnalysis.criticalReception.imdb}</p>
                                </div>
                                <div className="bg-[#0f172a] p-3 rounded-lg text-center">
                                    <p className="text-gray-400 text-sm">Metacritic</p>
                                    <p className="text-white font-semibold">{movieAnalysis.criticalReception.metacritic}</p>
                                </div>
                            </div>
                            <p className="text-gray-300 italic">{movieAnalysis.criticalReception.criticsConsensus}</p>
                        </div>

                        {/* Premios */}
                        {(movieAnalysis.awards.oscars.length > 0 || movieAnalysis.awards.goldenGlobes.length > 0) && (
                            <div className="mb-6">
                                <h4 className="text-lg font-semibold text-yellow-400 mb-3">🏆 Premios</h4>
                                <div className="space-y-3">
                                    {movieAnalysis.awards.oscars.length > 0 && (
                                        <div>
                                            <p className="text-orange-400 font-semibold mb-1">Premios Oscar:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {movieAnalysis.awards.oscars.map((award, index) => (
                                                    <span key={index} className="bg-orange-600/20 text-orange-300 px-2 py-1 rounded text-sm">
                                                        {award}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {movieAnalysis.awards.goldenGlobes.length > 0 && (
                                        <div>
                                            <p className="text-yellow-400 font-semibold mb-1">Globos de Oro:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {movieAnalysis.awards.goldenGlobes.map((award, index) => (
                                                    <span key={index} className="bg-yellow-600/20 text-yellow-300 px-2 py-1 rounded text-sm">
                                                        {award}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Impacto Cultural */}
                        <div className="mb-6">
                            <h4 className="text-lg font-semibold text-yellow-400 mb-3">🌟 Impacto Cultural</h4>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-gray-400 text-sm mb-1">Legado:</p>
                                    <p className="text-gray-300">{movieAnalysis.culturalImpact.legacy}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm mb-1">Influencia:</p>
                                    <p className="text-gray-300">{movieAnalysis.culturalImpact.influence}</p>
                                </div>
                                {movieAnalysis.culturalImpact.trivia.length > 0 && (
                                    <div>
                                        <p className="text-gray-400 text-sm mb-2">Datos curiosos:</p>
                                        <ul className="space-y-1">
                                            {movieAnalysis.culturalImpact.trivia.map((fact, index) => (
                                                <li key={index} className="text-gray-300 text-sm flex items-start gap-2">
                                                    <span className="text-purple-400 mt-1">•</span>
                                                    {fact}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Aspectos Técnicos */}
                        <div>
                            <h4 className="text-lg font-semibold text-yellow-400 mb-3">🎨 Aspectos Técnicos</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-[#0f172a] p-3 rounded-lg">
                                    <p className="text-gray-400 text-sm mb-1">Cinematografía</p>
                                    <p className="text-gray-300 text-sm">{movieAnalysis.technicalAspects.cinematography}</p>
                                </div>
                                <div className="bg-[#0f172a] p-3 rounded-lg">
                                    <p className="text-gray-400 text-sm mb-1">Banda Sonora</p>
                                    <p className="text-gray-300 text-sm">{movieAnalysis.technicalAspects.soundtrack}</p>
                                </div>
                                <div className="bg-[#0f172a] p-3 rounded-lg">
                                    <p className="text-gray-400 text-sm mb-1">Efectos Visuales</p>
                                    <p className="text-gray-300 text-sm">{movieAnalysis.technicalAspects.visualEffects}</p>
                                </div>
                                <div className="bg-[#0f172a] p-3 rounded-lg">
                                    <p className="text-gray-400 text-sm mb-1">Montaje</p>
                                    <p className="text-gray-300 text-sm">{movieAnalysis.technicalAspects.editing}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Modal de Detalles del Actor */}
                {selectedActor && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
                        onClick={() => setSelectedActor(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-[#1a1f2e] rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-yellow-400">{selectedActor}</h3>
                                <button
                                    onClick={() => setSelectedActor(null)}
                                    className="text-gray-400 hover:text-white text-2xl"
                                >
                                    ×
                                </button>
                            </div>
                            
                            {actorLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
                                </div>
                            ) : actorDetails ? (
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-lg font-semibold text-purple-400 mb-2">Biografía</h4>
                                        <p className="text-gray-300">{actorDetails.biography}</p>
                                    </div>
                                    
                                    <div>
                                        <h4 className="text-lg font-semibold text-purple-400 mb-2">Filmografía Destacada</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {actorDetails.filmography.map((film: string, index: number) => (
                                                <span key={index} className="bg-blue-600/20 text-blue-300 px-2 py-1 rounded text-sm">
                                                    {film}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    {actorDetails.awards.length > 0 && (
                                        <div>
                                            <h4 className="text-lg font-semibold text-purple-400 mb-2">Premios</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {actorDetails.awards.map((award: string, index: number) => (
                                                    <span key={index} className="bg-orange-600/20 text-orange-300 px-2 py-1 rounded text-sm">
                                                        {award}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    
                                    <div>
                                        <h4 className="text-lg font-semibold text-purple-400 mb-2">Información Personal</h4>
                                        <p className="text-gray-300">{actorDetails.personalLife}</p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-400">No se pudo cargar la información del actor.</p>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </div>
            </div>

            {/* Sección de Comentarios */}
            {movie && (
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <CommentsSection
                        mediaId={movie.id}
                        mediaType={isTV ? 'tv' : 'movie'}
                        title={movie.title}
                        posterPath={movie.poster_path || undefined}
                    />
                </div>
            )}

            {/* 🔘 Botón flotante (solo móvil) */}
            <motion.button
                onClick={handleBack}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut", delay: 0.3 }}
                className="fixed bottom-6 left-6 sm:hidden flex items-center justify-center w-12 h-12 
                    rounded-full bg-[#0f172a]/80 backdrop-blur-md border border-gray-700/50 
                    text-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.3)] 
                    hover:shadow-[0_0_20px_rgba(250,204,21,0.6)] transition-all z-50"
                whileTap={{ scale: 0.9 }}
            >
                ←
            </motion.button>
        </div>
    );
};

export default MovieDetail;
