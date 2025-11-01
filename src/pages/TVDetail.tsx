import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getTVDetails } from "../services/tmdb";
import type { FC } from "react";

interface Season {
    id: number;
    name: string;
    episode_count: number;
    poster_path: string | null;
    overview: string;
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
        cast: { id: number; name: string; profile_path: string | null }[];
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
        <div className="relative max-w-6xl mx-auto p-4 sm:p-6 flex flex-col md:flex-row gap-8 animate-fadeIn">
            {/* 📺 Poster */}
            {tv.poster_path && (
                <img
                    src={`https://image.tmdb.org/t/p/w500${tv.poster_path}`}
                    alt={tv.name}
                    className="w-full md:w-72 rounded-xl shadow-glow"
                />
            )}

            {/* 📄 Información principal */}
            <div className="flex-1">
                <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                    {tv.name}
                </h2>

                {/* 🔹 Línea de metadatos + botón volver */}
                <div className="flex justify-between items-center mb-3 flex-wrap gap-3">
                    <p className="text-gray-400">
                        ⭐ {tv.vote_average.toFixed(1)} | {tv.first_air_date} •{" "}
                        {tv.number_of_seasons} temporadas ({tv.number_of_episodes} episodios)
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
                        {tv.credits?.cast.slice(0, 10).map((actor) => (
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

                {/* 📚 Temporadas */}
                <div>
                    <h3 className="text-lg font-semibold text-yellow-400 mb-4">Temporadas</h3>
                    <div className="space-y-3">
                        {tv.seasons.map((season, index) => (
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
                                                className="w-32 rounded-lg shadow-md"
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
