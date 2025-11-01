import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
    getPopularMovies,
    getTopRatedMovies,
    getTrendingMovies,
    getPopularTV,
    getTopRatedTV,
    getTrendingTV,
} from "../services/tmdb";
import { Plus, Check } from "lucide-react";
import type { Movie } from "../services/tmdb";
import toast from "react-hot-toast";

const GENRES = [
    { id: 28, name: "Acción" },
    { id: 12, name: "Aventura" },
    { id: 16, name: "Animación" },
    { id: 35, name: "Comedia" },
    { id: 80, name: "Crimen" },
    { id: 99, name: "Documental" },
    { id: 18, name: "Drama" },
    { id: 10751, name: "Familiar" },
    { id: 14, name: "Fantasía" },
    { id: 27, name: "Terror" },
    { id: 10749, name: "Romance" },
    { id: 878, name: "Ciencia ficción" },
    { id: 53, name: "Suspenso" },
];

export default function Explore() {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState("popular");
    const [activeType, setActiveType] = useState<"movie" | "tv">("movie");
    const [activeGenre, setActiveGenre] = useState<number | null>(null);
    const [items, setItems] = useState<Movie[]>([]);
    const [myList, setMyList] = useState<Movie[]>([]);

    // ✅ Leer tipo desde la URL (?type=tv)
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const typeParam = params.get("type");
        if (typeParam === "tv" || typeParam === "movie") {
            setActiveType(typeParam);
        }
    }, [location.search]);

    // 🔸 Cargar favoritos desde localStorage
    useEffect(() => {
        const stored = localStorage.getItem("myList");
        if (stored) setMyList(JSON.parse(stored));
    }, []);

    // 🔸 Cargar datos según tipo (pelis/series), pestaña y género
    useEffect(() => {
        const fetchData = async () => {
            try {
                let data;

                if (activeType === "movie") {
                    if (activeTab === "trending") data = await getTrendingMovies();
                    else if (activeTab === "top") data = await getTopRatedMovies();
                    else data = await getPopularMovies();
                } else {
                    if (activeTab === "trending") data = await getTrendingTV();
                    else if (activeTab === "top") data = await getTopRatedTV();
                    else data = await getPopularTV();
                }

                const filtered = activeGenre
                    ? data.results.filter((m) => m.genre_ids?.includes(activeGenre))
                    : data.results;

                const normalized = filtered.map((item: any) => ({
                    ...item,
                    title: item.title || item.name,
                }));

                setItems(normalized);
            } catch {
                toast.error("Error cargando contenido");
            }
        };

        fetchData();
    }, [activeTab, activeGenre, activeType]);

    // 🔸 Añadir o quitar de mi lista
    const toggleMyList = (item: Movie) => {
        let updated = [...myList];
        const exists = updated.find((m) => m.id === item.id);

        if (exists) {
            updated = updated.filter((m) => m.id !== item.id);
            toast.error(`${item.title} eliminada de tu lista ❌`);
        } else {
            updated.push(item);
            toast.success(`${item.title} añadida a tu lista ✅`);
        }

        setMyList(updated);
        localStorage.setItem("myList", JSON.stringify(updated));
    };

    const isInMyList = (id: number) => myList.some((m) => m.id === id);
    const displayedItems = activeTab === "mylist" ? myList : items;

    return (
        <div className="p-4 sm:p-6">
            {/* 🔹 Selector Películas / Series */}
            <div className="flex flex-wrap justify-center gap-3 mb-6">
                {["movie", "tv"].map((type) => (
                    <button
                        key={type}
                        onClick={() => setActiveType(type as "movie" | "tv")}
                        className={`px-4 py-2 rounded-full font-medium transition-all ${activeType === type
                                ? "bg-gradient-to-r from-orange-400 to-yellow-400 text-black shadow-glow"
                                : "bg-[#1a1f2e] text-gray-300 hover:text-white"
                            }`}
                    >
                        {type === "movie" ? "Películas" : "Series"}
                    </button>
                ))}
            </div>

            {/* 🔹 Tabs (Populares, Tendencias, etc.) */}
            <div className="flex flex-wrap justify-center gap-6 mb-8 border-b border-gray-700 pb-2">
                {[
                    { key: "popular", label: "Populares" },
                    { key: "trending", label: "Tendencias" },
                    { key: "top", label: "Mejor valoradas" },
                    { key: "mylist", label: "Mi lista" },
                ].map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`pb-2 transition ${activeTab === tab.key
                                ? "text-yellow-400 border-b-2 border-yellow-400"
                                : "text-gray-400 hover:text-white"
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* 🔹 Filtros de género */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
                {GENRES.map((g) => (
                    <button
                        key={g.id}
                        onClick={() =>
                            setActiveGenre(activeGenre === g.id ? null : g.id)
                        }
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${activeGenre === g.id
                                ? "bg-gradient-to-r from-orange-400 to-yellow-400 text-black shadow-glow"
                                : "bg-[#1a1f2e] text-gray-300 hover:text-white"
                            }`}
                    >
                        {g.name}
                    </button>
                ))}
            </div>

            {/* 🔹 Resultados */}
            {displayedItems.length === 0 ? (
                <p className="text-gray-400 text-center">
                    No hay resultados para mostrar.
                </p>
            ) : (
                <motion.div
                    key={activeTab + activeType}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6"
                >
                    {displayedItems.map((item) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className="bg-[#101523] rounded-lg overflow-hidden shadow-md hover:shadow-glow hover:scale-105 transition-transform duration-300"
                        >
                            <Link
                                to={`/${activeType === "movie" ? "movie" : "tv"}/${item.id}`}
                            >
                                {item.poster_path ? (
                                    <img
                                        src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                                        alt={item.title}
                                        className="w-full h-80 object-cover"
                                    />
                                ) : (
                                    <div className="h-80 flex items-center justify-center bg-gray-700 text-gray-400">
                                        Sin imagen
                                    </div>
                                )}
                            </Link>

                            {/* 🔸 Footer de cada card */}
                            <div className="p-3 flex justify-between items-center">
                                <h3 className="text-sm font-semibold truncate w-32 text-gray-200">
                                    {item.title}
                                </h3>

                                <motion.button
                                    onClick={() => toggleMyList(item)}
                                    whileTap={{ scale: 0.85 }}
                                    className="p-1.5 rounded-full hover:bg-[#1f2937]/60 transition"
                                >
                                    {isInMyList(item.id) ? (
                                        <Check className="text-yellow-400 hover:text-yellow-300 w-5 h-5" />
                                    ) : (
                                        <Plus className="text-yellow-400 hover:text-yellow-300 w-5 h-5" />
                                    )}
                                </motion.button>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    );
}
