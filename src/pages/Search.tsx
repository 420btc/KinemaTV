import { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import type { Movie } from "../services/tmdb";
import { searchMovies, discoverMovies } from "../services/tmdb";
import type { FormEvent } from "react";

export default function Search() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedYear, setSelectedYear] = useState<number | null>(null);
    const [searchInput, setSearchInput] = useState("");
    const [minRating, setMinRating] = useState<number | null>(null);
    const [maxRating, setMaxRating] = useState<number | null>(null);

    // leer query desde la URL
    const { search } = useLocation();
    const query = new URLSearchParams(search).get("query") || "";
    const navigate = useNavigate();

    // Generar lista de años (desde 1900 hasta el año actual)
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 1899 }, (_, i) => currentYear - i);

    useEffect(() => {
        if (!query.trim()) return;

        setLoading(true);
        setError(null);

        searchMovies(query, selectedYear || undefined, minRating || undefined, maxRating || undefined)
            .then((data) => setMovies(data.results))
            .catch(() => setError("Error en la búsqueda"))
            .finally(() => setLoading(false));
    }, [query, selectedYear, minRating, maxRating]);

    const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const year = event.target.value;
        setSelectedYear(year ? parseInt(year) : null);
    };

    const handleMinRatingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setMinRating(value ? parseFloat(value) : null);
    };

    const handleMaxRatingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setMaxRating(value ? parseFloat(value) : null);
    };

    const handleLocalSearch = (e: FormEvent) => {
        e.preventDefault();
        if (searchInput.trim()) {
            navigate(`/search?query=${encodeURIComponent(searchInput)}`);
        }
    };

    // Sincronizar el input local con el query de la URL
    useEffect(() => {
        setSearchInput(query);
    }, [query]);

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-6">Buscar Películas</h2>

            {/* Campo de búsqueda */}
            <form onSubmit={handleLocalSearch} className="mb-8">
                <div className="flex flex-col sm:flex-row gap-4 items-end">
                    <div className="flex-1">
                        <label htmlFor="search-input" className="block text-sm font-medium text-gray-300 mb-2">
                            Nombre de la película:
                        </label>
                        <input
                            id="search-input"
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="Escribe el nombre de la película..."
                            className="bg-gray-800 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                        />
                    </div>
                    <div className="sm:self-end">
                        <label htmlFor="year-filter" className="block text-sm font-medium text-gray-300 mb-2">
                            Filtrar por año:
                        </label>
                        <select
                            id="year-filter"
                            value={selectedYear || ""}
                            onChange={handleYearChange}
                            className="bg-gray-800 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-48 p-3"
                        >
                            <option value="">Todos los años</option>
                            {years.map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="sm:self-end">
                        <label htmlFor="min-rating" className="block text-sm font-medium text-gray-300 mb-2">
                            Puntuación mínima:
                        </label>
                        <input
                            id="min-rating"
                            type="number"
                            min="1.0"
                            max="9.9"
                            step="0.1"
                            value={minRating || ""}
                            onChange={handleMinRatingChange}
                            placeholder="1.0"
                            className="bg-gray-800 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-32 p-3"
                        />
                    </div>
                    <div className="sm:self-end">
                        <label htmlFor="max-rating" className="block text-sm font-medium text-gray-300 mb-2">
                            Puntuación máxima:
                        </label>
                        <input
                            id="max-rating"
                            type="number"
                            min="1.0"
                            max="9.9"
                            step="0.1"
                            value={maxRating || ""}
                            onChange={handleMaxRatingChange}
                            placeholder="9.9"
                            className="bg-gray-800 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-32 p-3"
                        />
                    </div>
                    <div className="sm:self-end">
                        <button
                            type="submit"
                            className="bg-gradient-to-r from-orange-400 to-yellow-400 text-black px-6 py-3 text-sm font-semibold rounded-lg transition hover:opacity-90 w-full sm:w-auto"
                        >
                            🔍 Buscar
                        </button>
                    </div>
                </div>
            </form>

            {query && (
                <>
                    <h3 className="text-xl font-bold mb-6">
                        Resultados para:{" "}
                        <span className="text-yellow-400">{query}</span>
                        {selectedYear && (
                            <span className="text-gray-400 text-lg ml-2">
                                (año {selectedYear})
                            </span>
                        )}
                        {(minRating || maxRating) && (
                            <span className="text-gray-400 text-lg ml-2">
                                (puntuación: {minRating || "1.0"} - {maxRating || "9.9"} ⭐)
                            </span>
                        )}
                    </h3>
                </>
            )}

            {/* Estados y Resultados - Solo mostrar si hay una búsqueda activa */}
            {query && (
                <>
                    {/* Estados */}
                    {loading && <p>Cargando...</p>}
                    {error && <p className="text-red-500">{error}</p>}
                    {!loading && !error && movies.length === 0 && (
                        <p>No se encontraron resultados para "{query}"
                            {selectedYear && ` en el año ${selectedYear}`}
                            {(minRating || maxRating) && ` con puntuación entre ${minRating || "1.0"} y ${maxRating || "9.9"}`}.
                        </p>
                    )}

                    {/* Resultados */}
                    {movies.length > 0 && (
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
                                        <div className="flex items-center justify-between mt-2">
                                            <span className="text-yellow-400 text-sm">
                                                ⭐ {movie.vote_average.toFixed(1)}
                                            </span>
                                            {movie.release_date && (
                                                <span className="text-gray-400 text-xs">
                                                    {new Date(movie.release_date).getFullYear()}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* Mensaje cuando no hay búsqueda activa */}
            {!query && (
                <div className="text-center py-12">
                    <p className="text-gray-400 text-lg mb-4">
                        👆 Escribe el nombre de una película para comenzar la búsqueda
                    </p>
                    <p className="text-gray-500 text-sm">
                        También puedes usar la barra de búsqueda del menú superior
                    </p>
                </div>
            )}
        </div>
    );
}
