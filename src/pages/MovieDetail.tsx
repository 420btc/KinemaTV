import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getMovieDetails } from "../services/tmdb";
import type { FC } from "react";

interface MovieDetails {
    id: number;
    title: string;
    overview: string;
    poster_path: string | null;
    release_date: string;
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
        <div className="relative max-w-6xl mx-auto p-4 sm:p-6 flex flex-col md:flex-row gap-8 animate-fadeIn">
            {/* 🎬 Poster */}
            {movie.poster_path && (
                <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full md:w-72 rounded-xl shadow-glow"
                />
            )}

            {/* 📄 Información principal */}
            <div className="flex-1 overflow-hidden">
                <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                    {movie.title}
                </h2>

                {/* 🔹 Línea de metadatos + botón volver */}
                <div className="flex justify-between items-center mb-3 flex-wrap gap-3">
                    <p className="text-gray-400">
                        ⭐ {movie.vote_average.toFixed(1)} | {movie.release_date}
                    </p>

                    {/* 🔙 Botón “Volver” (alineado al texto, flecha izquierda) */}
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
                                    className="w-24 text-center flex-shrink-0 bg-[#1a1f2e] rounded-lg p-2"
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
            </div>

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
