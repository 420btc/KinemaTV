import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { discoverMovies, searchMovies } from "../services/tmdb";
import { FavoriteButton } from "./FavoriteButton";
import { WatchlistButton } from "./WatchlistButton";
import type { Movie } from "../services/tmdb";

interface SeasonalList {
  title: string;
  description: string;
  icon: string;
  searchTerms: string[];
  genres?: number[];
  theme: {
    bg: string;
    accent: string;
  };
}

const getCurrentSeason = () => {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'autumn';
  return 'winter';
};

const getSeasonalLists = (): SeasonalList[] => {
  const season = getCurrentSeason();
  const month = new Date().getMonth() + 1;
  const day = new Date().getDate();
  
  const baseLists: Record<string, SeasonalList[]> = {
    spring: [
      {
        title: "Flores y Romances",
        description: "Historias de amor que florecen",
        icon: "🌸",
        searchTerms: ["romance", "spring", "love"],
        genres: [10749],
        theme: { bg: "from-pink-500/20 to-rose-500/20", accent: "text-pink-400" }
      },
      {
        title: "Aventuras al Aire Libre",
        description: "Perfectas para días soleados",
        icon: "🌱",
        searchTerms: ["adventure", "nature", "journey"],
        genres: [12],
        theme: { bg: "from-green-500/20 to-emerald-500/20", accent: "text-green-400" }
      }
    ],
    summer: [
      {
        title: "Blockbusters Explosivos",
        description: "Acción para el calor del verano",
        icon: "🔥",
        searchTerms: ["action", "blockbuster", "superhero"],
        genres: [28],
        theme: { bg: "from-orange-500/20 to-red-500/20", accent: "text-orange-400" }
      },
      {
        title: "Comedias Refrescantes",
        description: "Risas para días de playa",
        icon: "🏖️",
        searchTerms: ["comedy", "beach", "summer"],
        genres: [35],
        theme: { bg: "from-cyan-500/20 to-blue-500/20", accent: "text-cyan-400" }
      }
    ],
    autumn: [
      {
        title: "Misterios Otoñales",
        description: "Thrillers para noches frías",
        icon: "🍂",
        searchTerms: ["mystery", "thriller", "detective"],
        genres: [9648, 53],
        theme: { bg: "from-amber-500/20 to-orange-500/20", accent: "text-amber-400" }
      },
      {
        title: "Dramas Acogedores",
        description: "Historias profundas para reflexionar",
        icon: "🍁",
        searchTerms: ["drama", "family", "emotional"],
        genres: [18],
        theme: { bg: "from-yellow-500/20 to-amber-500/20", accent: "text-yellow-400" }
      }
    ],
    winter: [
      {
        title: "Fantasías Mágicas",
        description: "Mundos encantados para escapar",
        icon: "❄️",
        searchTerms: ["fantasy", "magic", "adventure"],
        genres: [14],
        theme: { bg: "from-blue-500/20 to-indigo-500/20", accent: "text-blue-400" }
      },
      {
        title: "Clásicos Navideños",
        description: "Espíritu festivo y familiar",
        icon: "🎄",
        searchTerms: ["christmas", "holiday", "family"],
        genres: [10751],
        theme: { bg: "from-red-500/20 to-green-500/20", accent: "text-red-400" }
      }
    ]
  };

  // Agregar listas especiales según fechas específicas
  const specialLists: SeasonalList[] = [];
  
  // Halloween (Octubre)
  if (month === 10) {
    specialLists.push({
      title: "Especial Halloween",
      description: "Sustos y escalofríos",
      icon: "🎃",
      searchTerms: ["horror", "halloween", "scary"],
      genres: [27],
      theme: { bg: "from-purple-500/20 to-black/20", accent: "text-purple-400" }
    });
  }
  
  // San Valentín (Febrero)
  if (month === 2 && day <= 14) {
    specialLists.push({
      title: "Especial San Valentín",
      description: "Amor en el aire",
      icon: "💕",
      searchTerms: ["romance", "love", "valentine"],
      genres: [10749],
      theme: { bg: "from-pink-500/20 to-red-500/20", accent: "text-pink-400" }
    });
  }

  return [...baseLists[season], ...specialLists];
};

interface SeasonalCurationProps {
  className?: string;
}

export function SeasonalCuration({ className = "" }: SeasonalCurationProps) {
  const [seasonalLists] = useState(getSeasonalLists());
  const [moviesData, setMoviesData] = useState<Record<string, Movie[]>>({});
  const [loading, setLoading] = useState(true);
  const scrollRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const scroll = (listTitle: string, direction: "left" | "right") => {
    const el = scrollRefs.current[listTitle];
    if (!el) return;
    const delta = direction === "left" ? -el.clientWidth : el.clientWidth;
    el.scrollTo({ left: el.scrollLeft + delta, behavior: "smooth" });
  };

  useEffect(() => {
    const loadSeasonalMovies = async () => {
      setLoading(true);
      const newMoviesData: Record<string, Movie[]> = {};

      for (const list of seasonalLists) {
        try {
          // Intentar con discover primero
          let response = await discoverMovies({
            genreIds: list.genres,
            sortBy: 'popularity.desc',
            minVoteAverage: 6.0,
            page: 1
          });

          // Si no hay suficientes resultados, usar búsqueda
          if (response.results.length < 8) {
            const searchTerm = list.searchTerms[Math.floor(Math.random() * list.searchTerms.length)];
            response = await searchMovies(searchTerm);
          }

          newMoviesData[list.title] = response.results.slice(0, 12);
        } catch (error) {
          console.error(`Error loading movies for ${list.title}:`, error);
          newMoviesData[list.title] = [];
        }
      }

      setMoviesData(newMoviesData);
      setLoading(false);
    };

    loadSeasonalMovies();
  }, [seasonalLists]);

  const getSeasonName = () => {
    const season = getCurrentSeason();
    const names = {
      spring: 'Primavera',
      summer: 'Verano',
      autumn: 'Otoño',
      winter: 'Invierno'
    };
    return names[season as keyof typeof names];
  };

  const getSeasonIcon = () => {
    const season = getCurrentSeason();
    const icons = {
      spring: '🌸',
      summer: '☀️',
      autumn: '🍂',
      winter: '❄️'
    };
    return icons[season as keyof typeof icons];
  };

  if (loading) {
    return (
      <div className={`${className}`}>
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-12 ${className}`}>
      {/* Solo mostrar Misterios Otoñales sin título principal */}
      {seasonalLists
        .filter(list => list.title === "Misterios Otoñales")
        .map((list) => (
        <div key={list.title} className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-2xl font-bold ${list.theme.accent} flex items-center gap-2`}>
                <span className="text-2xl">{list.icon}</span>
                {list.title}
              </h3>
              <p className="text-gray-400 text-sm mt-1">{list.description}</p>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => scroll(list.title, "left")}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => scroll(list.title, "right")}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          <div className="relative group">
            <div
              ref={(el) => {
                if (el) scrollRefs.current[list.title] = el;
              }}
              className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4 custom-scroll"
              style={{
                maskImage: 'linear-gradient(to right, transparent, black 40px, black calc(100% - 40px), transparent)',
                WebkitMaskImage: 'linear-gradient(to right, transparent, black 40px, black calc(100% - 40px), transparent)'
              }}
            >
              {moviesData[list.title]?.map((movie) => (
                <div
                  key={movie.id}
                  className="flex-none w-48 bg-gray-800/50 rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 group/card"
                >
                  <Link to={`/movie/${movie.id}`}>
                    <div className="aspect-[2/3] relative overflow-hidden">
                      {movie.poster_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                          alt={movie.title || movie.name}
                          className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                          <span className="text-gray-400 text-sm">Sin imagen</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
                    </div>
                  </Link>
                  
                  <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
                    <FavoriteButton movie={movie} />
                    <WatchlistButton movie={movie} />
                  </div>
                  
                  <div className="p-4">
                    <h4 className="text-white font-semibold text-sm mb-1 line-clamp-2">
                      {movie.title || movie.name}
                    </h4>
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
          </div>
        </div>
      ))}
    </div>
  );
}