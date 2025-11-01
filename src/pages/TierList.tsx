import { useState, useRef } from "react";
import { searchMovies, type Movie } from "../services/tmdb";
import html2canvas from "html2canvas";

interface TierLevel {
  id: string;
  name: string;
  color: string;
  movies: Movie[];
}

export default function TierList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [draggedMovie, setDraggedMovie] = useState<Movie | null>(null);
  const tierListRef = useRef<HTMLDivElement>(null);

  const [tiers, setTiers] = useState<TierLevel[]>([
    { id: "S", name: "S - Obra Maestra", color: "bg-gradient-to-r from-red-500 to-red-600", movies: [] },
    { id: "A", name: "A - Excelente", color: "bg-gradient-to-r from-orange-500 to-orange-600", movies: [] },
    { id: "B", name: "B - Muy Buena", color: "bg-gradient-to-r from-yellow-500 to-yellow-600", movies: [] },
    { id: "C", name: "C - Buena", color: "bg-gradient-to-r from-green-500 to-green-600", movies: [] },
    { id: "D", name: "D - Regular", color: "bg-gradient-to-r from-blue-500 to-blue-600", movies: [] },
    { id: "F", name: "F - Mala", color: "bg-gradient-to-r from-gray-500 to-gray-600", movies: [] },
  ]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await searchMovies(searchQuery);
      setSearchResults(response.results);
    } catch (error) {
      console.error("Error searching movies:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleDragStart = (movie: Movie) => {
    setDraggedMovie(movie);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, tierId: string) => {
    e.preventDefault();
    if (!draggedMovie) return;

    // Remover la película de todos los tiers
    setTiers(prevTiers => 
      prevTiers.map(tier => ({
        ...tier,
        movies: tier.movies.filter(movie => movie.id !== draggedMovie.id)
      }))
    );

    // Agregar la película al tier de destino
    setTiers(prevTiers => 
      prevTiers.map(tier => 
        tier.id === tierId 
          ? { ...tier, movies: [...tier.movies, draggedMovie] }
          : tier
      )
    );

    setDraggedMovie(null);
  };

  const removeMovieFromTier = (movieId: number, tierId: string) => {
    setTiers(prevTiers => 
      prevTiers.map(tier => 
        tier.id === tierId 
          ? { ...tier, movies: tier.movies.filter(movie => movie.id !== movieId) }
          : tier
      )
    );
  };

  const takeSnapshot = async () => {
    if (!tierListRef.current) return;

    try {
      const canvas = await html2canvas(tierListRef.current, {
        backgroundColor: '#0A0E1A',
        scale: 2,
        useCORS: true,
      });
      
      const link = document.createElement('a');
      link.download = `tierlist-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error("Error taking snapshot:", error);
    }
  };

  const clearTierList = () => {
    setTiers(prevTiers => 
      prevTiers.map(tier => ({ ...tier, movies: [] }))
    );
  };

  return (
    <div className="min-h-screen bg-[#0A0E1A] text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">
            🎬 Movie Tier List
          </h1>
          <p className="text-gray-300 mb-6">
            Crea tu tier list personalizado de películas. Busca películas y arrástralas a los diferentes niveles según tu gusto.
          </p>
          
          {/* Controls */}
          <div className="flex flex-wrap gap-4 mb-6">
            <button
              onClick={takeSnapshot}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition"
            >
              📸 Capturar Imagen
            </button>
            <button
              onClick={clearTierList}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition"
            >
              🗑️ Limpiar Todo
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Search Panel */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-6 sticky top-6">
              <h2 className="text-xl font-bold mb-4">Buscar Películas</h2>
              
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Buscar película..."
                  className="flex-1 bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                />
                <button
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="bg-gradient-to-r from-orange-400 to-yellow-400 text-black px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
                >
                  {isSearching ? "..." : "🔍"}
                </button>
              </div>

              {/* Search Results */}
              <div className="max-h-96 overflow-y-auto space-y-2">
                {searchResults.map((movie) => (
                  <div
                    key={movie.id}
                    draggable
                    onDragStart={() => handleDragStart(movie)}
                    className="flex items-center gap-3 p-2 bg-gray-700 rounded-lg cursor-grab hover:bg-gray-600 transition"
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                      alt={movie.title}
                      className="w-12 h-18 object-cover rounded"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder-movie.png';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{movie.title}</p>
                      <p className="text-xs text-gray-400">
                        {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tier List */}
          <div className="lg:col-span-2">
            <div ref={tierListRef} className="bg-gray-900 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6 text-center">Mi Tier List de Películas</h2>
              
              <div className="space-y-4">
                {tiers.map((tier) => (
                  <div
                    key={tier.id}
                    className="flex bg-gray-800 rounded-lg overflow-hidden min-h-[120px]"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, tier.id)}
                  >
                    {/* Tier Label */}
                    <div className={`${tier.color} w-24 flex items-center justify-center flex-shrink-0`}>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">{tier.id}</div>
                        <div className="text-xs text-white opacity-90 px-1">{tier.name.split(' - ')[1]}</div>
                      </div>
                    </div>

                    {/* Movies Container */}
                    <div className="flex-1 p-4 flex flex-wrap gap-2 items-start content-start min-h-[120px] bg-gray-700">
                      {tier.movies.length === 0 ? (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                          Arrastra películas aquí
                        </div>
                      ) : (
                        tier.movies.map((movie) => (
                          <div
                            key={movie.id}
                            className="relative group"
                          >
                            <img
                              src={`https://image.tmdb.org/t/p/w154${movie.poster_path}`}
                              alt={movie.title}
                              className="w-16 h-24 object-cover rounded shadow-lg hover:scale-105 transition-transform"
                              onError={(e) => {
                                e.currentTarget.src = '/placeholder-movie.png';
                              }}
                            />
                            <button
                              onClick={() => removeMovieFromTier(movie.id, tier.id)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              ×
                            </button>
                            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white text-xs p-1 rounded-b opacity-0 group-hover:opacity-100 transition-opacity">
                              {movie.title}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}