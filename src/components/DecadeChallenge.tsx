import { useState } from "react";
import { Link } from "react-router-dom";
import { discoverMovies } from "../services/tmdb";
import { FavoriteButton } from "./FavoriteButton";
import { WatchlistButton } from "./WatchlistButton";
import { CelestialSphere } from "./ui/celestial-sphere";
import type { Movie } from "../services/tmdb";

interface DecadeInfo {
  id: string;
  decade: string;
  name: string;
  icon: string;
  description: string;
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
    id: "2020s",
    decade: "2020s",
    name: "2020s",
    icon: "🚀",
    description: "Era digital y streaming",
    years: [2020, 2021, 2022, 2023, 2024],
    theme: {
      bg: "from-purple-900/20 via-blue-900/20 to-cyan-900/20",
      accent: "text-cyan-400",
      text: "text-cyan-100",
      description: "Era digital y streaming"
    }
  },
  {
    id: "2010s",
    decade: "2010s",
    name: "2010s",
    icon: "🦸",
    description: "Superhéroes y franquicias",
    years: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019],
    theme: {
      bg: "from-blue-900/20 via-indigo-900/20 to-purple-900/20",
      accent: "text-blue-400",
      text: "text-blue-100",
      description: "Superhéroes y franquicias"
    }
  },
  {
    id: "2000s",
    decade: "2000s",
    name: "2000s",
    icon: "💻",
    description: "CGI y efectos digitales",
    years: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009],
    theme: {
      bg: "from-green-900/20 via-teal-900/20 to-blue-900/20",
      accent: "text-green-400",
      text: "text-green-100",
      description: "CGI y efectos digitales"
    }
  },
  {
    id: "1990s",
    decade: "1990s",
    name: "1990s",
    icon: "🎬",
    description: "Blockbusters y independientes",
    years: [1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999],
    theme: {
      bg: "from-yellow-900/20 via-orange-900/20 to-red-900/20",
      accent: "text-yellow-400",
      text: "text-yellow-100",
      description: "Blockbusters y independientes"
    }
  },
  {
    id: "1980s",
    decade: "1980s",
    name: "1980s",
    icon: "🕺",
    description: "Neón y sintetizadores",
    years: [1980, 1981, 1982, 1983, 1984, 1985, 1986, 1987, 1988, 1989],
    theme: {
      bg: "from-pink-900/20 via-purple-900/20 to-indigo-900/20",
      accent: "text-pink-400",
      text: "text-pink-100",
      description: "Neón y sintetizadores"
    }
  },
  {
    id: "1970s",
    decade: "1970s",
    name: "1970s",
    icon: "🌻",
    description: "Nuevo Hollywood",
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
  const [completedMovies, setCompletedMovies] = useState<Set<number>>(new Set());

  // Calcular progreso
  const progress = movies.length > 0 ? (completedMovies.size / movies.length) * 100 : 0;

  // Función para marcar película como vista
  const toggleMovieCompleted = (movieId: number) => {
    setCompletedMovies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(movieId)) {
        newSet.delete(movieId);
      } else {
        newSet.add(movieId);
      }
      return newSet;
    });
  };

  const loadDecadeMovies = async (decade: DecadeInfo) => {
    setLoading(true);
    setSelectedDecade(decade);
    setCurrentYear(0);
    setCompletedMovies(new Set()); // Limpiar películas completadas al cambiar década
    
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
    setCompletedMovies(new Set()); // Limpiar películas completadas al cambiar año
    
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
        hue={280}
        speed={0.7}
        zoom={2.2}
        particleSize={3}
        className="fixed top-0 left-0 w-full h-full z-0"
      />
      
      {/* Contenido principal */}
      <div className="relative z-10 p-3 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent mb-4">
              🕰️ Decade Challenge
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto px-4">
              Viaja a través del tiempo y descubre las mejores películas de cada década
            </p>
          </div>

          {/* Selector de década */}
          <div className="flex justify-center mb-6 sm:mb-8">
            <div className="flex flex-wrap justify-center gap-1 sm:gap-2 bg-white/10 rounded-full p-1 sm:p-2 max-w-full">
              {decades.map((decade) => (
                <button
                  key={decade.id}
                  onClick={() => loadDecadeMovies(decade)}
                  className={`px-3 py-2 sm:px-6 sm:py-3 rounded-full transition-all duration-300 text-sm sm:text-base whitespace-nowrap ${
                    selectedDecade?.id === decade.id
                      ? 'bg-white/20 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {decade.icon} {decade.name}
                </button>
              ))}
            </div>
          </div>

          {!selectedDecade ? (
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-white px-4">
                Elige una década para explorar 🎬
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-2 sm:px-0">
                {decades.map((decade) => (
                  <div
                    key={decade.id}
                    onClick={() => loadDecadeMovies(decade)}
                    className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${decade.theme.bg} 
                              border border-white/10 cursor-pointer transform transition-all duration-300 
                              hover:scale-105 hover:shadow-2xl group`}
                  >
                    <div className="p-4 sm:p-6">
                      <div className="text-4xl sm:text-5xl mb-2 sm:mb-3 text-center">{decade.icon}</div>
                      <h3 className={`text-lg sm:text-xl font-bold ${decade.theme.accent} mb-2 text-center`}>
                        {decade.name}
                      </h3>
                      <p className={`text-sm sm:text-base ${decade.theme.text} text-center`}>
                        {decade.description}
                      </p>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <div className="flex flex-col sm:flex-row items-center justify-between mb-6 sm:mb-8 gap-4 px-2 sm:px-0">
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
                  <h2 className={`text-xl sm:text-3xl font-bold ${selectedDecade.theme.accent} mb-2`}>
                    {selectedDecade.icon} {selectedDecade.name}
                  </h2>
                  <p className={`text-sm sm:text-base ${selectedDecade.theme.text} mb-2`}>
                    {selectedDecade.description}
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <span className={`text-sm ${selectedDecade.theme.text}`}>Año: {currentYear}</span>
                    <button
                      onClick={nextYear}
                      className={`px-3 py-1 rounded-full text-xs ${selectedDecade.theme.accent} border border-current hover:bg-white/10 transition-colors`}
                    >
                      Cambiar año
                    </button>
                  </div>
                </div>

                <div className="text-center sm:text-right">
                  <div className={`text-xl sm:text-2xl font-bold ${selectedDecade.theme.accent}`}>
                    {completedMovies.size}/{movies.length}
                  </div>
                  <div className="w-24 sm:w-32 bg-gray-700 rounded-full h-2 mt-2">
                    <div 
                      className={`h-2 rounded-full bg-gradient-to-r ${selectedDecade.theme.bg.replace('/20', '')}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-400"></div>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 px-2 sm:px-0">
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
                       <button
                         onClick={(e) => {
                           e.preventDefault();
                           toggleMovieCompleted(movie.id);
                         }}
                         className={`p-1 rounded-full transition-colors ${
                           completedMovies.has(movie.id)
                             ? 'bg-green-500 text-white'
                             : 'bg-black/50 text-gray-300 hover:text-white'
                         }`}
                         title={completedMovies.has(movie.id) ? 'Marcar como no vista' : 'Marcar como vista'}
                       >
                         {completedMovies.has(movie.id) ? '✓' : '👁️'}
                       </button>
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