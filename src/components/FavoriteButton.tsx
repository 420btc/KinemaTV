import React from 'react';
import { Heart } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';

interface FavoriteButtonProps {
  movie: {
    id: number;
    title?: string;
    name?: string;
    poster_path?: string | null;
    release_date?: string;
  };
  className?: string;
}

export function FavoriteButton({ movie, className = '' }: FavoriteButtonProps) {
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const isMovieFavorite = isFavorite(movie.id);
  
  // Obtener el título correcto (title para películas, name para series)
  const movieTitle = movie.title || movie.name || 'Sin título';

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isMovieFavorite) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites({
        ...movie,
        title: movieTitle
      });
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`p-2 rounded-full transition-all duration-200 ${
        isMovieFavorite
          ? 'bg-red-500 text-white hover:bg-red-600'
          : 'bg-gray-800/80 text-gray-300 hover:bg-red-500 hover:text-white'
      } ${className}`}
      title={isMovieFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
    >
      <Heart
        size={18}
        className={isMovieFavorite ? 'fill-current' : ''}
      />
    </button>
  );
}