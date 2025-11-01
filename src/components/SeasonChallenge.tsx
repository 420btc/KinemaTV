import { useState } from "react";
import { Link } from "react-router-dom";
import { discoverMovies, searchMovies } from "../services/tmdb";
import { FavoriteButton } from "./FavoriteButton";
import { WatchlistButton } from "./WatchlistButton";
import { CelestialSphere } from "./ui/celestial-sphere";
import type { Movie } from "../services/tmdb";

interface SeasonChallenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  theme: {
    bg: string;
    accent: string;
    text: string;
  };
  searchTerms: string[];
  genres?: number[];
  minYear?: number;
}

const getCurrentSeason = () => {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'autumn';
  return 'winter';
};

const seasonChallenges: Record<string, SeasonChallenge[]> = {
  spring: [
    {
      id: 'spring-romance',
      title: 'Romances de Primavera',
      description: 'Películas románticas que florecen como las flores',
      icon: '🌸',
      theme: {
        bg: 'from-pink-900/20 via-rose-900/20 to-red-900/20',
        accent: 'text-pink-400',
        text: 'text-pink-100'
      },
      searchTerms: ['romance', 'love', 'wedding'],
      genres: [10749], // Romance
      minYear: 2000
    },
    {
      id: 'spring-renewal',
      title: 'Nuevos Comienzos',
      description: 'Historias de transformación y crecimiento personal',
      icon: '🌱',
      theme: {
        bg: 'from-green-900/20 via-emerald-900/20 to-teal-900/20',
        accent: 'text-green-400',
        text: 'text-green-100'
      },
      searchTerms: ['journey', 'change', 'growth'],
      genres: [18], // Drama
      minYear: 2010
    }
  ],
  summer: [
    {
      id: 'summer-blockbuster',
      title: 'Blockbusters de Verano',
      description: 'Acción explosiva para los días calurosos',
      icon: '🔥',
      theme: {
        bg: 'from-orange-900/20 via-red-900/20 to-yellow-900/20',
        accent: 'text-orange-400',
        text: 'text-orange-100'
      },
      searchTerms: ['action', 'adventure', 'superhero'],
      genres: [28, 12], // Action, Adventure
      minYear: 2015
    },
    {
      id: 'summer-beach',
      title: 'Vibes Playeros',
      description: 'Películas perfectas para el ambiente veraniego',
      icon: '🏖️',
      theme: {
        bg: 'from-cyan-900/20 via-blue-900/20 to-teal-900/20',
        accent: 'text-cyan-400',
        text: 'text-cyan-100'
      },
      searchTerms: ['beach', 'summer', 'vacation'],
      genres: [35, 10749], // Comedy, Romance
      minYear: 2005
    }
  ],
  autumn: [
    {
      id: 'autumn-mystery',
      title: 'Misterios Otoñales',
      description: 'Thrillers perfectos para noches frías',
      icon: '🍂',
      theme: {
        bg: 'from-amber-900/20 via-orange-900/20 to-red-900/20',
        accent: 'text-amber-400',
        text: 'text-amber-100'
      },
      searchTerms: ['mystery', 'thriller', 'detective'],
      genres: [9648, 53], // Mystery, Thriller
      minYear: 2000
    },
    {
      id: 'autumn-cozy',
      title: 'Películas Acogedoras',
      description: 'Dramas familiares para tardes de lluvia',
      icon: '🍁',
      theme: {
        bg: 'from-yellow-900/20 via-amber-900/20 to-orange-900/20',
        accent: 'text-yellow-400',
        text: 'text-yellow-100'
      },
      searchTerms: ['family', 'home', 'cozy'],
      genres: [18, 10751], // Drama, Family
      minYear: 2010
    }
  ],
  winter: [
    {
      id: 'winter-fantasy',
      title: 'Fantasías Invernales',
      description: 'Mundos mágicos para escapar del frío',
      icon: '❄️',
      theme: {
        bg: 'from-blue-900/20 via-indigo-900/20 to-purple-900/20',
        accent: 'text-blue-400',
        text: 'text-blue-100'
      },
      searchTerms: ['fantasy', 'magic', 'winter'],
      genres: [14, 878], // Fantasy, Sci-Fi
      minYear: 2005
    },
    {
      id: 'winter-holiday',
      title: 'Espíritu Navideño',
      description: 'Películas festivas para celebrar',
      icon: '🎄',
      theme: {
        bg: 'from-red-900/20 via-green-900/20 to-red-900/20',
        accent: 'text-red-400',
        text: 'text-red-100'
      },
      searchTerms: ['christmas', 'holiday', 'family'],
      genres: [35, 10751], // Comedy, Family
      minYear: 1990
    }
  ]
};

export function SeasonChallenge() {
  const [currentSeason, setCurrentSeason] = useState(getCurrentSeason());
  const [selectedChallenge, setSelectedChallenge] = useState<SeasonChallenge | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completedMovies, setCompletedMovies] = useState<Set<number>>(new Set());

  const loadChallengeMovies = async (challenge: SeasonChallenge) => {
    setLoading(true);
    setSelectedChallenge(challenge);
    
    try {
      // Intentar con discover primero
      let response = await discoverMovies({
        genreIds: challenge.genres,
        sortBy: 'popularity.desc',
        minVoteAverage: 6.5,
        page: 1
      });

      // Si no hay suficientes resultados, usar búsqueda por términos
      if (response.results.length < 10) {
        const searchTerm = challenge.searchTerms[Math.floor(Math.random() * challenge.searchTerms.length)];
        response = await searchMovies(searchTerm);
      }
      
      setMovies(response.results.slice(0, 20));
    } catch (error) {
      console.error('Error loading challenge movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const markMovieAsWatched = (movieId: number) => {
    const newCompleted = new Set(completedMovies);
    if (newCompleted.has(movieId)) {
      newCompleted.delete(movieId);
    } else {
      newCompleted.add(movieId);
    }
    setCompletedMovies(newCompleted);
    setProgress((newCompleted.size / movies.length) * 100);
  };

  const getSeasonName = (season: string) => {
    const names = {
      spring: 'Primavera',
      summer: 'Verano',
      autumn: 'Otoño',
      winter: 'Invierno'
    };
    return names[season as keyof typeof names];
  };

  const getSeasonIcon = (season: string) => {
    const icons = {
      spring: '🌸',
      summer: '☀️',
      autumn: '🍂',
      winter: '❄️'
    };
    return icons[season as keyof typeof icons];
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
      <div className="relative z-10 p-3 sm:p-6">
        <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent mb-4">
            🎯 Season Challenge
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto px-4">
            Desafíos cinematográficos que cambian con las estaciones. ¡Completa tu lista y desbloquea logros!
          </p>
        </div>

        {/* Selector de estación */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="flex flex-wrap justify-center gap-1 sm:gap-2 bg-white/10 rounded-full p-1 sm:p-2 max-w-full">
            {Object.keys(seasonChallenges).map((season) => (
              <button
                key={season}
                onClick={() => setCurrentSeason(season)}
                className={`px-3 py-2 sm:px-6 sm:py-3 rounded-full transition-all duration-300 text-sm sm:text-base whitespace-nowrap ${
                  currentSeason === season
                    ? 'bg-white/20 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {getSeasonIcon(season)} {getSeasonName(season)}
              </button>
            ))}
          </div>
        </div>

        {!selectedChallenge ? (
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-white px-4">
              Desafíos de {getSeasonName(currentSeason)} {getSeasonIcon(currentSeason)}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 px-2 sm:px-0">
              {seasonChallenges[currentSeason].map((challenge) => (
                <div
                  key={challenge.id}
                  onClick={() => loadChallengeMovies(challenge)}
                  className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${challenge.theme.bg} 
                            border border-white/10 cursor-pointer transform transition-all duration-300 
                            hover:scale-105 hover:shadow-2xl group`}
                >
                  <div className="p-4 sm:p-8">
                    <div className="text-4xl sm:text-6xl mb-2 sm:mb-4 text-center">{challenge.icon}</div>
                    <h3 className={`text-lg sm:text-2xl font-bold ${challenge.theme.accent} mb-2 sm:mb-3 text-center`}>
                      {challenge.title}
                    </h3>
                    <p className={`text-sm sm:text-lg ${challenge.theme.text} text-center`}>
                      {challenge.description}
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
                onClick={() => setSelectedChallenge(null)}
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Volver a desafíos</span>
              </button>
              
              <div className="text-center">
                <h2 className={`text-xl sm:text-3xl font-bold ${selectedChallenge.theme.accent} mb-2`}>
                  {selectedChallenge.icon} {selectedChallenge.title}
                </h2>
                <p className={`text-sm sm:text-base ${selectedChallenge.theme.text}`}>
                  {selectedChallenge.description}
                </p>
              </div>

              <div className="text-center sm:text-right">
                <div className={`text-xl sm:text-2xl font-bold ${selectedChallenge.theme.accent}`}>
                  {completedMovies.size}/{movies.length}
                </div>
                <div className="w-24 sm:w-32 bg-gray-700 rounded-full h-2 mt-2">
                  <div 
                    className={`h-2 rounded-full bg-gradient-to-r ${selectedChallenge.theme.bg.replace('/20', '')}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-400"></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {movies.map((movie) => (
                  <div
                    key={movie.id}
                    className={`group relative bg-gray-800/50 rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 ${
                      completedMovies.has(movie.id) ? 'ring-2 ring-green-400' : ''
                    }`}
                  >
                    <Link to={`/movie/${movie.id}`}>
                      <div className="aspect-[2/3] relative overflow-hidden">
                        {movie.poster_path ? (
                          <img
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                            alt={movie.title || movie.name}
                            className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 ${
                              completedMovies.has(movie.id) ? 'opacity-75' : ''
                            }`}
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                            <span className="text-gray-400">Sin imagen</span>
                          </div>
                        )}
                        
                        {completedMovies.has(movie.id) && (
                          <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                            <div className="bg-green-500 rounded-full p-2">
                              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>
                    </Link>
                    
                    <div className="absolute top-2 right-2 flex space-x-1">
                      <FavoriteButton movie={movie} />
                      <WatchlistButton movie={movie} />
                    </div>
                    
                    <div className="absolute bottom-2 left-2">
                      <button
                        onClick={() => markMovieAsWatched(movie.id)}
                        className={`p-2 rounded-full transition-all duration-300 ${
                          completedMovies.has(movie.id)
                            ? 'bg-green-500 text-white'
                            : 'bg-white/20 text-gray-300 hover:bg-white/30'
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
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