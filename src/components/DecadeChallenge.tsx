import { useState } from "react";
import { Link } from "react-router-dom";
import { discoverMovies } from "../services/tmdb";
import { FavoriteButton } from "./FavoriteButton";
import { WatchlistButton } from "./WatchlistButton";
import { CelestialSphere } from "./ui/celestial-sphere";
import type { Movie } from "../services/tmdb";

interface DecadeInfo {
  decade: string;
  years: number[];
  theme: {
    bg: string;
    accent: string;
    text: string;
    description: string;
  };
}

const decades: DecadeInfo[] = [
  {
    decade: "2020s",
    years: [2020, 2021, 2022, 2023, 2024],
    theme: {
      bg: "from-purple-900/20 via-blue-900/20 to-cyan-900/20",
      accent: "text-cyan-400",
      text: "text-cyan-100",
      description: "Era digital y streaming"
    }
  },
  {
    decade: "2010s",
    years: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019],
    theme: {
      bg: "from-blue-900/20 via-indigo-900/20 to-purple-900/20",
      accent: "text-blue-400",
      text: "text-blue-100",
      description: "Superhéroes y franquicias"
    }
  },
  {
    decade: "2000s",
    years: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009],
    theme: {
      bg: "from-green-900/20 via-teal-900/20 to-blue-900/20",
      accent: "text-green-400",
      text: "text-green-100",
      description: "CGI y efectos digitales"
    }
  },
  {
    decade: "1990s",
    years: [1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999],
    theme: {
      bg: "from-yellow-900/20 via-orange-900/20 to-red-900/20",
      accent: "text-yellow-400",
      text: "text-yellow-100",
      description: "Blockbusters y independientes"
    }
  },
  {
    decade: "1980s",
    years: [1980, 1981, 1982, 1983, 1984, 1985, 1986, 1987, 1988, 1989],
    theme: {
      bg: "from-pink-900/20 via-purple-900/20 to-indigo-900/20",
      accent: "text-pink-400",
      text: "text-pink-100",
      description: "Neón y sintetizadores"
    }
  },
  {
    decade: "1970s",
    years: [1970, 1971, 1972, 1973, 1974, 1975, 1976, 1977, 1978, 1979],
    theme: {
      bg: "from-orange-900/20 via-amber-900/20 to-yellow-900/20",
      accent: "text-orange-400",
      text: "text-orange-100",
      description: "Nuevo Hollywood"
    }
  }
];

export function DecadeChallenge() {
  const [selectedDecade, setSelectedDecade] = useState<DecadeInfo | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentYear, setCurrentYear] = useState(0);

  const loadDecadeMovies = async (decade: DecadeInfo) => {
    setLoading(true);
    setSelectedDecade(decade);
    setCurrentYear(0);
    
    try {
      // Obtener películas de un año aleatorio de la década
      const randomYear = decade.years[Math.floor(Math.random() * decade.years.length)];
      setCurrentYear(randomYear);
      
      const response = await discoverMovies({
        year: randomYear,
        sortBy: 'popularity.desc',
        minVoteAverage: 6.0,
        page: 1
      });
      
      setMovies(response.results.slice(0, 12));
    } catch (error) {
      console.error('Error loading decade movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextYear = async () => {
    if (!selectedDecade) return;
    
    const currentIndex = selectedDecade.years.indexOf(currentYear);
    const nextIndex = (currentIndex + 1) % selectedDecade.years.length;
    const nextYearValue = selectedDecade.years[nextIndex];
    
    setCurrentYear(nextYearValue);
    setLoading(true);
    
    try {
      const response = await discoverMovies({
        year: nextYearValue,
        sortBy: 'popularity.desc',
        minVoteAverage: 6.0,
        page: 1
      });
      
      setMovies(response.results.slice(0, 12));
    } catch (error) {
      console.error('Error loading next year:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Shader de fondo */}
      <CelestialSphere
        hue={10}
        speed={0.9}
        zoom={1.8}
        particleSize={2.5}
        className="fixed top-0 left-0 w-full h-full z-0"
      />
      
      {/* Contenido principal */}
      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent mb-4">
            🎬 Década Challenge
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Viaja a través del tiempo cinematográfico. Explora las mejores películas de cada década.
          </p>
        </div>

        {!selectedDecade ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {decades.map((decade) => (
              <div
                key={decade.decade}
                onClick={() => loadDecadeMovies(decade)}
                className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${decade.theme.bg} 
                          border border-white/10 cursor-pointer transform transition-all duration-300 
                          hover:scale-105 hover:shadow-2xl group`}
              >
                <div className="p-8 text-center">
                  <h3 className={`text-4xl font-bold ${decade.theme.accent} mb-2`}>
                    {decade.decade}
                  </h3>
                  <p className={`text-lg ${decade.theme.text} mb-4`}>
                    {decade.theme.description}
                  </p>
                  <div className="flex justify-center space-x-2 text-sm text-gray-400">
                    <span>{decade.years[0]}</span>
                    <span>-</span>
                    <span>{decade.years[decade.years.length - 1]}</span>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={() => setSelectedDecade(null)}
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Volver a décadas</span>
              </button>
              
              <div className="text-center">
                <h2 className={`text-3xl font-bold ${selectedDecade.theme.accent} mb-2`}>
                  {selectedDecade.decade} - {currentYear}
                </h2>
                <p className={`${selectedDecade.theme.text}`}>
                  {selectedDecade.theme.description}
                </p>
              </div>

              <button
                onClick={nextYear}
                disabled={loading}
                className={`px-6 py-3 rounded-full ${selectedDecade.theme.accent} bg-white/10 
                          hover:bg-white/20 transition-all duration-300 disabled:opacity-50`}
              >
                {loading ? "Cargando..." : "Siguiente año"}
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-400"></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                {movies.map((movie) => (
                  <div
                    key={movie.id}
                    className="group relative bg-gray-800/50 rounded-xl overflow-hidden hover:scale-105 transition-all duration-300"
                  >
                    <Link to={`/movie/${movie.id}`}>
                      <div className="aspect-[2/3] relative overflow-hidden">
                        {movie.poster_path ? (
                          <img
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                            alt={movie.title || movie.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                            <span className="text-gray-400">Sin imagen</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    </Link>
                    
                    <div className="absolute top-2 right-2 flex space-x-1">
                       <FavoriteButton movie={movie} />
                       <WatchlistButton movie={movie} />
                     </div>
                    <div className="p-4">
                      <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">
                        {movie.title || movie.name}
                      </h3>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>{movie.release_date?.split('-')[0] || movie.first_air_date?.split('-')[0]}</span>
                        <span className="flex items-center">
                          ⭐ {movie.vote_average.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      </div>
    </div>
  );
}