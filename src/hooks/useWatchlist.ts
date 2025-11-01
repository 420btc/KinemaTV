import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@stackframe/stack';
import toast from 'react-hot-toast';

export interface WatchlistItem {
  id: string;
  userId: string;
  movieId: number;
  title: string;
  posterPath?: string;
  releaseDate?: string;
  createdAt: Date;
}

export function useWatchlist() {
  const stackUser = useUser();
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchWatchlist = useCallback(async () => {
    if (!stackUser || !stackUser.id) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/watchlist/${stackUser.id}`);
      if (response.ok) {
        const data = await response.json();
        setWatchlist(data);
      }
    } catch (error) {
      console.error('Error fetching watchlist:', error);
    } finally {
      setIsLoading(false);
    }
  }, [stackUser]);

  const addToWatchlist = async (movie: { id: number; title: string; poster_path?: string | null; release_date?: string }) => {
    if (!stackUser || !stackUser.id) return;

    try {
      const response = await fetch('/api/watchlist', {
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
        const newItem = await response.json();
        setWatchlist(prev => [...prev, newItem]);
        toast.success('Agregado a tu lista');
      } else {
        toast.error('Error al agregar a tu lista');
      }
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      toast.error('Error al agregar a tu lista');
    }
  };

  const removeFromWatchlist = async (movieId: number) => {
    if (!stackUser || !stackUser.id) return;

    try {
      const response = await fetch(`/api/watchlist/${stackUser.id}/${movieId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setWatchlist(prev => prev.filter(item => item.movieId !== movieId));
        toast.success('Eliminado de tu lista');
      } else {
        toast.error('Error al eliminar de tu lista');
      }
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      toast.error('Error al eliminar de tu lista');
    }
  };

  const isInWatchlist = (movieId: number) => {
    return watchlist.some(item => item.movieId === movieId);
  };

  useEffect(() => {
    if (stackUser) {
      fetchWatchlist();
    } else {
      setWatchlist([]);
    }
  }, [stackUser, fetchWatchlist]);

  return {
    watchlist,
    isLoading,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    refetch: fetchWatchlist,
  };
}