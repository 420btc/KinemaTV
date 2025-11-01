import { useEffect, useState } from "react";
import {
  CardTransformed,
  CardsContainer,
  ContainerScroll,
  ReviewStars,
} from "./ui/animated-cards-stack";
import { getTrendingMovies, getPopularMovies } from "../services/tmdb";
import type { Movie } from "../services/tmdb";
import { FavoriteButton } from "./FavoriteButton";
import { WatchlistButton } from "./WatchlistButton";
import { Link } from "react-router-dom";

export function KinemaHero() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtener películas populares y en tendencia para el hero
    Promise.all([
      getTrendingMovies('week'),
      getPopularMovies()
    ])
      .then(([trending, popular]) => {
        // Mezclar y tomar las primeras 6 películas
        const allMovies = [...trending.results, ...popular.results];
        const uniqueMovies = allMovies.filter((movie, index, self) => 
          index === self.findIndex(m => m.id === movie.id)
        );
        setMovies(uniqueMovies.slice(0, 6));
      })
      .catch(error => {
        console.error("Error loading hero movies:", error);
        // Fallback con datos mock si falla la API
        setMovies([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="relative min-h-[150px] flex items-center justify-center">
        <div className="text-kinematv-yellow text-lg">Cargando...</div>
      </section>
    );
  }

  return (
    <section className="relative">
      {/* Título KINEMA TV */}
      <div className="text-center relative z-20 px-4">
        <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-bold text-kinematv-yellow tracking-wider permanent-marker-regular drop-shadow-2xl shadow-black/80">
          KINEMA TV
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-300 mt-1 max-w-2xl mx-auto px-2">
          Descubre las mejores películas y series en un solo lugar
        </p>
      </div>

      {/* Tarjetas animadas de películas */}
      <ContainerScroll className="h-[200vh] sm:h-[250vh] lg:h-[300vh] relative -mt-4">
        <div className="sticky left-0 top-0 h-svh w-full pt-8 sm:pt-4 lg:pt-2 flex items-center lg:items-center justify-center px-4 lg:pt-16">
          <CardsContainer className="mx-auto h-[400px] sm:h-[450px] md:h-[500px] lg:h-[600px] xl:h-[650px] w-[280px] sm:w-[320px] md:w-[380px] lg:w-[450px] xl:w-[500px]">
            {movies.map((movie, index) => (
              <CardTransformed
                key={movie.id}
                arrayLength={movies.length}
                index={index + 1}
                variant="dark"
                className="overflow-hidden !rounded-xl !p-0 border-kinematv-yellow/20 hover:border-kinematv-yellow/50 transition-all duration-300"
              >
                <Link 
                  to={`/movie/${movie.id}`} 
                  className="block h-full w-full relative group"
                >
                  {/* Imagen de la película */}
                  {movie.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title || movie.name}
                      className="w-full h-[280px] sm:h-[320px] md:h-[380px] lg:h-[450px] xl:h-[500px] object-cover rounded-t-xl"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-[280px] sm:h-[320px] md:h-[380px] lg:h-[450px] xl:h-[500px] w-full flex items-center justify-center text-gray-500 bg-[#1E2533] rounded-t-xl">
                      Sin imagen
                    </div>
                  )}
                  
                  {/* Información de la película */}
                  <div className="p-3 sm:p-4 md:p-6 lg:p-7 xl:p-8 bg-gradient-to-t from-black/95 to-transparent absolute bottom-0 left-0 right-0 rounded-b-xl">
                    <h3 className="text-white font-bold text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl mb-2 sm:mb-3 lg:mb-4 line-clamp-2">
                      {movie.title || movie.name}
                    </h3>
                    
                    {/* Rating con estrellas */}
                    <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 mb-2 sm:mb-4 lg:mb-5">
                      <ReviewStars
                        rating={movie.vote_average / 2} // Convertir de 10 a 5 estrellas
                        className="text-kinematv-yellow text-sm sm:text-base lg:text-lg xl:text-xl"
                      />
                      <span className="text-kinematv-yellow text-sm sm:text-base lg:text-lg xl:text-xl font-medium">
                        {movie.vote_average.toFixed(1)}
                      </span>
                    </div>

                    {/* Fecha de lanzamiento */}
                    {(movie.release_date || movie.first_air_date) && (
                      <p className="text-gray-300 text-sm sm:text-base lg:text-lg xl:text-xl">
                        {new Date(movie.release_date || movie.first_air_date!).getFullYear()}
                      </p>
                    )}
                  </div>

                  {/* Overlay de hover */}
                  <div className="absolute inset-0 bg-kinematv-yellow/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                </Link>

                {/* Botones de favoritos y watchlist */}
                <div className="absolute top-2 sm:top-3 lg:top-4 xl:top-5 right-2 sm:right-3 lg:right-4 xl:right-5 flex flex-col gap-1 sm:gap-2 lg:gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                  <FavoriteButton movie={movie} />
                  <WatchlistButton movie={movie} />
                </div>
              </CardTransformed>
            ))}
          </CardsContainer>
        </div>
      </ContainerScroll>
    </section>
  );
}