import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@stackframe/stack';
import toast from 'react-hot-toast';

export interface Favorite {
  id: string;
  userId: string;
  movieId: number;
  title: string;
  posterPath?: string;
  releaseDate?: string;
  createdAt: Date;
}

export function useFavorites() {
  const stackUser = useUser();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchFavorites = useCallback(async () => {
    if (!stackUser || !stackUser.id) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/favorites/${stackUser.id}`);
      if (response.ok) {
        const data = await response.json();
        setFavorites(data);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setIsLoading(false);
    }
  }, [stackUser]);

  const addToFavorites = async (movie: { id: number; title: string; poster_path?: string | null; release_date?: string }) => {
    if (!stackUser || !stackUser.id) return;

    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: stackUser.id,
          movieId: movie.id,
          title: movie.title,
          posterPath: movie.poster_path,
          releaseDate: movie.release_date,
        }),
      });

      if (response.ok) {
        const newFavorite = await response.json();
        setFavorites(prev => [...prev, newFavorite]);
        toast.success('Agregado a favoritos');
      } else {
        toast.error('Error al agregar a favoritos');
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
      toast.error('Error al agregar a favoritos');
    }
  };

  const removeFromFavorites = async (movieId: number) => {
    if (!stackUser || !stackUser.id) return;

    try {
      const response = await fetch(`/api/favorites/${stackUser.id}/${movieId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setFavorites(prev => prev.filter(fav => fav.movieId !== movieId));
        toast.success('Eliminado de favoritos');
      } else {
        toast.error('Error al eliminar de favoritos');
      }
    } catch (error) {
      console.error('Error removing from favorites:', error);
      toast.error('Error al eliminar de favoritos');
    }
  };

  const isFavorite = (movieId: number) => {
    return favorites.some(fav => fav.movieId === movieId);
  };

  useEffect(() => {
    if (stackUser) {
      fetchFavorites();
    } else {
      setFavorites([]);
    }
  }, [stackUser, fetchFavorites]);

  return {
    favorites,
    isLoading,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    refetch: fetchFavorites,
  };
}