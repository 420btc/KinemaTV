import { prisma } from '../lib/prisma.js';

export async function getWatchlist(userId: string) {
  try {
    const watchlist = await prisma.watchlist.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return watchlist;
  } catch (error) {
    console.error('Error fetching watchlist:', error);
    throw error;
  }
}

export async function addToWatchlist(data: {
  userId: string;
  movieId: number;
  title: string;
  posterPath?: string;
  releaseDate?: string;
}) {
  try {
    // Verificar si ya existe
    const existing = await prisma.watchlist.findUnique({
      where: {
        userId_movieId: {
          userId: data.userId,
          movieId: data.movieId,
        },
      },
    });

    if (existing) {
      throw new Error('Movie already in watchlist');
    }

    const watchlistItem = await prisma.watchlist.create({
      data: {
        userId: data.userId,
        movieId: data.movieId,
        title: data.title,
        posterPath: data.posterPath,
        releaseDate: data.releaseDate,
      },
    });

    return watchlistItem;
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    throw error;
  }
}

export async function removeFromWatchlist(userId: string, movieId: number) {
  try {
    const deleted = await prisma.watchlist.delete({
      where: {
        userId_movieId: {
          userId,
          movieId,
        },
      },
    });
    return deleted;
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    throw error;
  }
}