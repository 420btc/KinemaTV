import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getTVDetails } from "../services/tmdb";
import { SendToChatButton } from "../components/SendToChatButton";
import { CelestialSphere } from "../components/ui/celestial-sphere";
import { fetchSeriesAnalysis, fetchActorDetails } from "../services/movieAnalysis";
import CommentsSection from "../components/CommentsSection";
import type { SeriesAnalysis, ActorDetails } from "../api/openai";
import type { FC } from "react";

interface Season {
    id: number;
    name: string;
    episode_count: number;
    poster_path: string | null;
    overview: string;
}

interface CastMember {
    id: number;
    name: string;
    profile_path: string | null;
}

interface AnalysisCastMember {
    name: string;
    character: string;
    biography: string;
    filmography: string[];
}

interface TVDetails {
    id: number;
    name: string;
    overview: string;
    poster_path: string | null;
    first_air_date: string;
    vote_average: number;
    number_of_seasons: number;
    number_of_episodes: number;
    genres: { id: number; name: string }[];
    seasons: Season[];
    credits?: {
        cast: CastMember[];
    };
    videos?: {
        results: { key: string; type: string; site: string }[];
    };
}

const TVDetail: FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [tv, setTV] = useState<TVDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [openSeason, setOpenSeason] = useState<number | null>(null);

    // Estados para análisis avanzado
    const [seriesAnalysis, setSeriesAnalysis] = useState<SeriesAnalysis | null>(null);
    const [analysisLoading, setAnalysisLoading] = useState(false);
    const [analysisError, setAnalysisError] = useState<string | null>(null);
    const [showAnalysis, setShowAnalysis] = useState(false);
    const [selectedActor, setSelectedActor] = useState<string | null>(null);
    const [actorDetails, setActorDetails] = useState<ActorDetails | null>(null);
    const [actorLoading, setActorLoading] = useState(false);

    // 🔹 Detectar si estamos en serie o película según la ruta
    const isTV = window.location.pathname.includes("/tv/");

    useEffect(() => {
        if (!id) return;
        getTVDetails(id)
            .then((data) => {
                setTV(data);
                setLoading(false);
            })
            .catch(() => {
                setError("Error cargando detalles de la serie");
                setLoading(false);
            });
    }, [id]);

    const handleBack = () => {
        navigate(`/explore?type=${isTV ? "tv" : "movie"}`);
    };

    // Función para obtener análisis avanzado
    const handleGetAnalysis = async () => {
        if (!tv) return;
        
        setAnalysisLoading(true);
        setAnalysisError(null);
        
        try {
            const releaseYear = tv.first_air_date ? new Date(tv.first_air_date).getFullYear() : undefined;
            const genres = tv.genres?.map(g => g.name);
            const analysis = await fetchSeriesAnalysis(tv.name, releaseYear, genres);
            
            setSeriesAnalysis(analysis);
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
    if (!tv) return null;

    const trailer = tv.videos?.results.find(
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
            {/* 📺 Poster */}
            {tv.poster_path && (
                <img
                    src={`https://image.tmdb.org/t/p/w500${tv.poster_path}`}
                    alt={tv.name}
                    className="w-56 h-80 object-cover rounded-xl shadow-glow flex-shrink-0"
                />
            )}

            {/* 📄 Información principal */}
            <div className="flex-1">
                <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                    {tv.name}
                </h2>

                {/* 🔹 Línea de metadatos + botón volver */}
                <div className="flex justify-between items-center mb-3 flex-wrap gap-3">
                    <div className="flex items-center gap-4">
                        <p className="text-gray-400">
                            ⭐ {tv.vote_average.toFixed(1)} | {tv.first_air_date} •{" "}
                            {tv.number_of_seasons} temporadas ({tv.number_of_episodes} episodios)
                        </p>
                        
                        {/* Botón de enviar al chat */}
                        <div className="flex gap-2">
                            <SendToChatButton series={tv} type="tv" />
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

                <p className="mb-4 text-gray-200 leading-relaxed">{tv.overview}</p>

                {/* 🎭 Géneros */}
                <div className="mb-4">
                    <h3 className="text-lg font-semibold text-yellow-400 mb-1">Géneros</h3>
                    <p className="text-gray-300">{tv.genres.map((g) => g.name).join(", ")}</p>
                </div>

                {/* 🎬 Trailer */}
                {trailer && (
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-yellow-400 mb-2">Tráiler</h3>
                        <iframe
                            className="w-full md:w-[500px] h-64 rounded-lg shadow-md"
                            src={`https://www.youtube.com/embed/${trailer.key}`}
                            title="Trailer"
                            allowFullScreen
                        ></iframe>
                    </div>
                )}

                {/* 👥 Reparto */}
                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-yellow-400 mb-3">
                        Reparto principal
                    </h3>
                    <div className="flex gap-4 overflow-x-auto pb-2 pr-2 scrollbar-thin scrollbar-thumb-yellow-400/50 scrollbar-track-transparent">
                        {tv.credits?.cast.slice(0, 10).map((actor: CastMember) => (
                            <div
                                key={actor.id}
                                className="w-24 text-center flex-shrink-0 bg-[#1a1f2e] rounded-lg p-2 cursor-pointer hover:bg-[#252b3d] transition-colors"
                                onClick={() => handleActorClick(actor.name)}
                            >
                                {actor.profile_path ? (
                                    <img
                                        src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                                        alt={actor.name}
                                        className="w-full h-32 object-cover rounded-lg mb-1"
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
                {showAnalysis && seriesAnalysis && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-8 bg-gradient-to-br from-[#1a1f2e] to-[#252b3d] rounded-xl p-6 border border-purple-500/20"
                    >
                        <h3 className="text-2xl font-bold text-purple-400 mb-6 flex items-center gap-2">
                            🤖 Análisis Avanzado de Serie
                        </h3>

                        {/* Reparto Detallado */}
                        <div className="mb-6">
                            <h4 className="text-lg font-semibold text-yellow-400 mb-3">🎭 Reparto Detallado</h4>
                            <div className="space-y-4">
                                {seriesAnalysis.cast.slice(0, 5).map((actor: AnalysisCastMember, index: number) => (
                                    <div key={index} className="bg-[#0f172a] p-4 rounded-lg">
                                        <div className="flex justify-between items-start mb-2">
                                            <h5 className="font-semibold text-white">{actor.name}</h5>
                                            <span className="text-gray-400 text-sm">como {actor.character}</span>
                                        </div>
                                        <p className="text-gray-300 text-sm mb-2">{actor.biography}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {actor.filmography.slice(0, 3).map((work: string, workIndex: number) => (
                                                <span key={workIndex} className="bg-purple-600/20 text-purple-300 px-2 py-1 rounded text-xs">
                                                    {work}
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
                                    <p className="text-gray-400 text-sm">Cadena/Plataforma</p>
                                    <p className="text-white">{seriesAnalysis.production.network}</p>
                                </div>
                                <div className="bg-[#0f172a] p-3 rounded-lg">
                                    <p className="text-gray-400 text-sm">Creadores</p>
                                    <p className="text-white">{seriesAnalysis.production.creators.join(', ')}</p>
                                </div>
                                <div className="bg-[#0f172a] p-3 rounded-lg">
                                    <p className="text-gray-400 text-sm">Productores</p>
                                    <p className="text-white">{seriesAnalysis.production.producers.join(', ')}</p>
                                </div>
                                <div className="bg-[#0f172a] p-3 rounded-lg">
                                    <p className="text-gray-400 text-sm">Showrunners</p>
                                    <p className="text-white">{seriesAnalysis.production.showrunners.join(', ')}</p>
                                </div>
                            </div>
                        </div>

                        {/* Información de la Serie */}
                        <div className="mb-6">
                            <h4 className="text-lg font-semibold text-yellow-400 mb-3">📺 Información de la Serie</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="bg-[#0f172a] p-3 rounded-lg">
                                    <p className="text-gray-400 text-sm">Temporadas</p>
                                    <p className="text-white font-semibold">{seriesAnalysis.seriesInfo.seasons}</p>
                                </div>
                                <div className="bg-[#0f172a] p-3 rounded-lg">
                                    <p className="text-gray-400 text-sm">Episodios Totales</p>
                                    <p className="text-white font-semibold">{seriesAnalysis.seriesInfo.episodes}</p>
                                </div>
                                <div className="bg-[#0f172a] p-3 rounded-lg">
                                    <p className="text-gray-400 text-sm">Estado</p>
                                    <p className="text-white font-semibold">{seriesAnalysis.seriesInfo.status}</p>
                                </div>
                                <div className="bg-[#0f172a] p-3 rounded-lg">
                                    <p className="text-gray-400 text-sm">Duración</p>
                                    <p className="text-white font-semibold">{seriesAnalysis.seriesInfo.runtime}</p>
                                </div>
                            </div>
                        </div>

                        {/* Premios */}
                        <div className="mb-6">
                            <h4 className="text-lg font-semibold text-yellow-400 mb-3">🏆 Premios y Reconocimientos</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-[#0f172a] p-3 rounded-lg">
                                    <p className="text-gray-400 text-sm">Emmy Awards</p>
                                    <div className="text-white">
                                        {seriesAnalysis.awards.emmys.map((award: string, index: number) => (
                                            <p key={index} className="text-sm">{award}</p>
                                        ))}
                                    </div>
                                </div>
                                <div className="bg-[#0f172a] p-3 rounded-lg">
                                    <p className="text-gray-400 text-sm">Golden Globe</p>
                                    <div className="text-white">
                                        {seriesAnalysis.awards.goldenGlobes.map((award: string, index: number) => (
                                            <p key={index} className="text-sm">{award}</p>
                                        ))}
                                    </div>
                                </div>
                                <div className="bg-[#0f172a] p-3 rounded-lg">
                                    <p className="text-gray-400 text-sm">Otros Premios</p>
                                    <div className="text-white">
                                        {seriesAnalysis.awards.otherAwards.map((award: string, index: number) => (
                                            <p key={index} className="text-sm">{award}</p>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recepción Crítica */}
                        <div className="mb-6">
                            <h4 className="text-lg font-semibold text-yellow-400 mb-3">📊 Recepción Crítica</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div className="bg-[#0f172a] p-3 rounded-lg text-center">
                                    <p className="text-gray-400 text-sm">Rotten Tomatoes</p>
                                    <p className="text-white font-bold text-lg">{seriesAnalysis.criticalReception.rottenTomatoes}</p>
                                </div>
                                <div className="bg-[#0f172a] p-3 rounded-lg text-center">
                                    <p className="text-gray-400 text-sm">IMDb</p>
                                    <p className="text-white font-bold text-lg">{seriesAnalysis.criticalReception.imdb}</p>
                                </div>
                                <div className="bg-[#0f172a] p-3 rounded-lg text-center">
                                    <p className="text-gray-400 text-sm">Metacritic</p>
                                    <p className="text-white font-bold text-lg">{seriesAnalysis.criticalReception.metacritic}</p>
                                </div>
                            </div>
                            <div className="bg-[#0f172a] p-4 rounded-lg">
                                <p className="text-gray-400 text-sm mb-2">Consenso Crítico:</p>
                                <p className="text-white text-sm leading-relaxed">{seriesAnalysis.criticalReception.criticsConsensus}</p>
                            </div>
                        </div>

                        {/* Impacto Cultural */}
                        <div className="mb-6">
                            <h4 className="text-lg font-semibold text-yellow-400 mb-3">🌍 Impacto Cultural</h4>
                            <div className="bg-[#0f172a] p-4 rounded-lg space-y-4">
                                <div>
                                    <p className="text-gray-400 text-sm mb-2">Legado:</p>
                                    <p className="text-white text-sm leading-relaxed">{seriesAnalysis.culturalImpact.legacy}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm mb-2">Influencia:</p>
                                    <p className="text-white text-sm leading-relaxed">{seriesAnalysis.culturalImpact.influence}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm mb-2">Curiosidades:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {seriesAnalysis.culturalImpact.trivia.map((fact: string, index: number) => (
                                            <span key={index} className="bg-blue-600/20 text-blue-300 px-2 py-1 rounded text-xs">
                                                {fact}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Aspectos Técnicos */}
                        <div className="mb-6">
                            <h4 className="text-lg font-semibold text-yellow-400 mb-3">🎥 Aspectos Técnicos</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-[#0f172a] p-3 rounded-lg">
                                    <p className="text-gray-400 text-sm">Cinematografía</p>
                                    <p className="text-white">{seriesAnalysis.technicalAspects.cinematography}</p>
                                </div>
                                <div className="bg-[#0f172a] p-3 rounded-lg">
                                    <p className="text-gray-400 text-sm">Banda Sonora</p>
                                    <p className="text-white">{seriesAnalysis.technicalAspects.soundtrack}</p>
                                </div>
                                <div className="bg-[#0f172a] p-3 rounded-lg">
                                    <p className="text-gray-400 text-sm">Efectos Visuales</p>
                                    <p className="text-white">{seriesAnalysis.technicalAspects.visualEffects}</p>
                                </div>
                                <div className="bg-[#0f172a] p-3 rounded-lg">
                                    <p className="text-gray-400 text-sm">Edición</p>
                                    <p className="text-white">{seriesAnalysis.technicalAspects.editing}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Modal de Detalles del Actor */}
                {selectedActor && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-[#1a1f2e] rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-yellow-400">{selectedActor}</h3>
                                <button
                                    onClick={() => {
                                        setSelectedActor(null);
                                        setActorDetails(null);
                                    }}
                                    className="text-gray-400 hover:text-white text-2xl"
                                >
                                    ×
                                </button>
                            </div>
                            
                            {actorLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-yellow-400 border-t-transparent"></div>
                                </div>
                            ) : actorDetails ? (
                                <div className="space-y-4">
                                    <p className="text-gray-300">{actorDetails.biography}</p>
                                    <div>
                                        <h4 className="text-lg font-semibold text-yellow-400 mb-2">Filmografía Notable</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {actorDetails.filmography.map((work: string, index: number) => (
                                                <span key={index} className="bg-purple-600/20 text-purple-300 px-2 py-1 rounded text-sm">
                                                    {work}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold text-yellow-400 mb-2">Premios</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {actorDetails.awards.map((award: string, index: number) => (
                                                <span key={index} className="bg-yellow-600/20 text-yellow-300 px-2 py-1 rounded text-sm">
                                                    {award}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-400">No se pudieron cargar los detalles del actor.</p>
                            )}
                        </motion.div>
                    </div>
                )}

                {/* 📚 Temporadas */}
                <div>
                    <h3 className="text-lg font-semibold text-yellow-400 mb-4">Temporadas</h3>
                    <div className="space-y-3">
                        {tv.seasons.map((season: Season, index: number) => (
                            <div
                                key={season.id}
                                className="bg-[#101523] rounded-lg overflow-hidden shadow-md hover:shadow-glow transition-all"
                            >
                                <button
                                    onClick={() =>
                                        setOpenSeason(openSeason === index ? null : index)
                                    }
                                    className="w-full flex justify-between items-center p-3 text-left text-gray-200 font-semibold"
                                >
                                    <span>
                                        {season.name} • {season.episode_count} episodios
                                    </span>
                                    <span
                                        className={`transform transition-transform ${openSeason === index ? "rotate-90 text-yellow-400" : ""
                                            }`}
                                    >
                                        ▶
                                    </span>
                                </button>

                                {openSeason === index && (
                                    <div className="p-3 border-t border-gray-700 flex flex-col sm:flex-row gap-4">
                                        {season.poster_path && (
                                            <img
                                                src={`https://image.tmdb.org/t/p/w200${season.poster_path}`}
                                                alt={season.name}
                                                className="w-32 h-auto object-cover rounded-lg shadow-md flex-shrink-0"
                                            />
                                        )}
                                        <p className="text-gray-300 text-sm leading-relaxed">
                                            {season.overview || "Sin descripción disponible."}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            </div>

            {/* Sección de Comentarios */}
            {tv && (
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <CommentsSection
                        mediaId={tv.id}
                        mediaType="tv"
                        title={tv.name}
                        posterPath={tv.poster_path || undefined}
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

export default TVDetail;
