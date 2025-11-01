import React from 'react';
import { Bookmark } from 'lucide-react';
import { useWatchlist } from '../hooks/useWatchlist';

interface WatchlistButtonProps {
  movie: {
    id: number;
    title?: string;
    name?: string;
    poster_path?: string | null;
    release_date?: string;
  };
  className?: string;
}

export function WatchlistButton({ movie, className = '' }: WatchlistButtonProps) {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const isMovieInWatchlist = isInWatchlist(movie.id);
  
  // Obtener el título correcto (title para películas, name para series)
  const movieTitle = movie.title || movie.name || 'Sin título';

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isMovieInWatchlist) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist({
        ...movie,
        title: movieTitle
      });
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`p-2 rounded-full transition-all duration-200 ${
        isMovieInWatchlist
          ? 'bg-blue-500 text-white hover:bg-blue-600'
          : 'bg-gray-800/80 text-gray-300 hover:bg-blue-500 hover:text-white'
      } ${className}`}
      title={isMovieInWatchlist ? 'Quitar de mi lista' : 'Agregar a mi lista'}
    >
      <Bookmark
        size={18}
        className={isMovieInWatchlist ? 'fill-current' : ''}
      />
    </button>
  );
}