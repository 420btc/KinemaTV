import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import type { Movie } from "../services/tmdb";
import { searchMovies } from "../services/tmdb";

export default function Search() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedYear, setSelectedYear] = useState<number | null>(null);

    // leer query desde la URL
    const { search } = useLocation();
    const query = new URLSearchParams(search).get("query") || "";

    // Generar lista de años (desde 1900 hasta el año actual)
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 1899 }, (_, i) => currentYear - i);

    useEffect(() => {
        if (!query.trim()) return;

        setLoading(true);
        setError(null);

        searchMovies(query, selectedYear || undefined)
            .then((data) => setMovies(data.results))
            .catch(() => setError("Error en la búsqueda"))
            .finally(() => setLoading(false));
    }, [query, selectedYear]);

    const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const year = event.target.value;
        setSelectedYear(year ? parseInt(year) : null);
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">
                Resultados de búsqueda para:{" "}
                <span className="text-yellow-400">{query}</span>
                {selectedYear && (
                    <span className="text-gray-400 text-lg ml-2">
                        (año {selectedYear})
                    </span>
                )}
            </h2>

            {/* Filtro por año */}
            <div className="mb-6">
                <label htmlFor="year-filter" className="block text-sm font-medium text-gray-300 mb-2">
                    Filtrar por año:
                </label>
                <select
                    id="year-filter"
                    value={selectedYear || ""}
                    onChange={handleYearChange}
                    className="bg-gray-800 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-48 p-2.5"
                >
                    <option value="">Todos los años</option>
                    {years.map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
            </div>

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
                            <div className="flex justify-between items-center mt-1">
                                <p className="text-yellow-400 text-sm">
                                    ⭐ {movie.vote_average.toFixed(1)}
                                </p>
                                {movie.release_date && (
                                    <p className="text-gray-400 text-sm">
                                        {new Date(movie.release_date).getFullYear()}
                                    </p>
                                )}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
