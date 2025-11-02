import { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import type { Movie } from "../services/tmdb";
import { searchMovies, discoverMovies } from "../services/tmdb";
import type { FormEvent } from "react";
import CelestialSphere from '../components/ui/celestial-sphere';

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
        // Si no hay query ni filtros, no hacer nada
        if (!query.trim() && !selectedYear && !minRating && !maxRating) return;

        setLoading(true);
        setError(null);

        // Si hay texto de búsqueda, usar searchMovies
        if (query.trim()) {
            searchMovies(query, selectedYear || undefined, minRating || undefined, maxRating || undefined)
                .then((data) => setMovies(data.results))
                .catch(() => setError("Error en la búsqueda"))
                .finally(() => setLoading(false));
        } 
        // Si no hay texto pero sí filtros, usar discoverMovies
        else if (selectedYear || minRating || maxRating) {
            discoverMovies({
                year: selectedYear || undefined,
                minVoteAverage: minRating || undefined,
                sortBy: 'popularity.desc'
            })
                .then((data) => {
                    let results = data.results;
                    // Aplicar filtro de puntuación máxima si se especifica
                    if (maxRating !== undefined && maxRating !== null) {
                        results = results.filter(movie => movie.vote_average <= maxRating);
                    }
                    setMovies(results);
                })
                .catch(() => setError("Error al obtener películas"))
                .finally(() => setLoading(false));
        }
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
        <div className="relative min-h-screen">
            <CelestialSphere 
                hue={11}
                speed={0.9}
                zoom={1.2}
                particleSize={1.5}
                className="fixed top-0 left-0 w-full h-full z-0"
            />
            <div className="relative z-10 px-3 sm:px-6 lg:px-8 py-4 sm:py-8 max-w-7xl mx-auto">
                <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center sm:text-left">Buscar Películas</h2>

            {/* Campo de búsqueda */}
            <form onSubmit={handleLocalSearch} className="mb-6 sm:mb-8">
                <div className="flex flex-col gap-4 sm:gap-4">
                    {/* Campo de búsqueda principal */}
                    <div className="w-full">
                        <label htmlFor="search-input" className="block text-sm font-medium text-gray-300 mb-2">
                            Nombre de la película:
                        </label>
                        <input
                            id="search-input"
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="Escribe el nombre de la película..."
                            className="bg-gray-800 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 touch-manipulation"
                        />
                    </div>
                    
                    {/* Filtros en una fila en desktop, apilados en móvil */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label htmlFor="year-filter" className="block text-sm font-medium text-gray-300 mb-2">
                                Filtrar por año:
                            </label>
                            <select
                                id="year-filter"
                                value={selectedYear || ""}
                                onChange={handleYearChange}
                                className="bg-gray-800 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 touch-manipulation"
                            >
                                <option value="">Todos los años</option>
                                {years.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
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
                                className="bg-gray-800 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 touch-manipulation"
                            />
                        </div>
                        <div>
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
                                className="bg-gray-800 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 touch-manipulation"
                            />
                        </div>
                        <div className="sm:col-span-2 lg:col-span-1">
                            <label className="block text-sm font-medium text-gray-300 mb-2 sm:invisible">
                                Buscar
                            </label>
                            <button
                                type="submit"
                                className="bg-gradient-to-r from-orange-400 to-yellow-400 text-black px-6 py-3 text-sm font-semibold rounded-lg transition hover:opacity-90 active:scale-95 touch-manipulation w-full"
                            >
                                🔍 Buscar
                            </button>
                        </div>
                    </div>
                </div>
            </form>

            {(query || selectedYear || minRating || maxRating) && (
                <>
                    <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 px-2 sm:px-0">
                        {query ? (
                            <>
                                Resultados para:{" "}
                                <span className="text-yellow-400">{query}</span>
                            </>
                        ) : (
                            <span className="text-yellow-400">Películas filtradas</span>
                        )}
                        {selectedYear && (
                            <span className="text-gray-400 text-sm sm:text-lg ml-2 block sm:inline">
                                (año {selectedYear})
                            </span>
                        )}
                        {(minRating || maxRating) && (
                            <span className="text-gray-400 text-sm sm:text-lg ml-2 block sm:inline">
                                (puntuación: {minRating || "1.0"} - {maxRating || "9.9"} ⭐)
                            </span>
                        )}
                    </h3>
                </>
            )}

            {/* Estados y Resultados - Mostrar si hay una búsqueda activa o filtros aplicados */}
            {(query || selectedYear || minRating || maxRating) && (
                <>
                    {/* Estados */}
                    {loading && <p className="text-center py-8 text-gray-400">Cargando...</p>}
                    {error && <p className="text-red-500 text-center py-4 px-2">{error}</p>}
                    {!loading && !error && movies.length === 0 && (
                        <p className="text-center py-8 px-4 text-gray-400">No se encontraron resultados
                            {query && ` para "${query}"`}
                            {selectedYear && ` en el año ${selectedYear}`}
                            {(minRating || maxRating) && ` con puntuación entre ${minRating || "1.0"} y ${maxRating || "9.9"}`}.
                        </p>
                    )}

                    {/* Resultados */}
                    {movies.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6 px-2 sm:px-0">
                            {movies.map((movie) => (
                                <Link
                                    to={`/movie/${movie.id}`}
                                    key={movie.id}
                                    className="bg-gray-900 rounded-lg overflow-hidden shadow-md hover:shadow-xl hover:scale-105 transition transform duration-200 active:scale-95 touch-manipulation"
                                >
                                    {movie.poster_path ? (
                                        <img
                                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                            alt={movie.title}
                                            className="w-full h-48 sm:h-60 md:h-72 lg:h-80 object-cover"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="h-48 sm:h-60 md:h-72 lg:h-80 flex items-center justify-center bg-gray-700 text-gray-400 text-xs sm:text-sm">
                                            Sin imagen
                                        </div>
                                    )}
                                    <div className="p-2 sm:p-3">
                                        <h3 className="text-xs sm:text-sm md:text-base font-semibold line-clamp-2 mb-1 sm:mb-2">
                                            {movie.title}
                                        </h3>
                                        <div className="flex items-center justify-between">
                                            <span className="text-yellow-400 text-xs sm:text-sm">
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

            {/* Mensaje cuando no hay búsqueda ni filtros activos */}
            {!query && !selectedYear && !minRating && !maxRating && (
                <div className="text-center py-8 sm:py-12 px-4">
                    <p className="text-gray-400 text-base sm:text-lg mb-3 sm:mb-4">
                        👆 Escribe el nombre de una película o aplica filtros para comenzar la búsqueda
                    </p>
                    <p className="text-gray-500 text-sm">
                        Puedes buscar por nombre, año, puntuación o cualquier combinación de estos filtros
                    </p>
                </div>
            )}
            </div>
        </div>
    );
}
