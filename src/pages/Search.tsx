import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import type { Movie } from "../services/tmdb";
import { searchMovies } from "../services/tmdb";

export default function Search() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // leer query desde la URL
    const { search } = useLocation();
    const query = new URLSearchParams(search).get("query") || "";

    useEffect(() => {
        if (!query.trim()) return;

        setLoading(true);
        setError(null);

        searchMovies(query)
            .then((data) => setMovies(data.results))
            .catch(() => setError("Error en la búsqueda"))
            .finally(() => setLoading(false));
    }, [query]);

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">
                Resultados de búsqueda para:{" "}
                <span className="text-yellow-400">{query}</span>
            </h2>

            {/* Estados */}
            {loading && <p>Cargando...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && !error && movies.length === 0 && (
                <p>No se encontraron resultados.</p>
            )}

            {/* Resultados */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {movies.map((movie) => (
                    <Link
                        to={`/movie/${movie.id}`}
                        key={movie.id}
                        className="bg-gray-900 rounded-lg overflow-hidden shadow-md hover:shadow-xl hover:scale-105 transition transform duration-200"
                    >
                        {movie.poster_path ? (
                            <img
                                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                alt={movie.title}
                                className="w-full h-80 object-cover"
                                loading="lazy"
                            />
                        ) : (
                            <div className="h-80 flex items-center justify-center bg-gray-700 text-gray-400">
                                Sin imagen
                            </div>
                        )}
                        <div className="p-3">
                            <h3 className="text-base font-semibold truncate">
                                {movie.title}
                            </h3>
                            <p className="text-yellow-400 text-sm mt-1">
                                ⭐ {movie.vote_average.toFixed(1)}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
