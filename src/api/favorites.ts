import { prisma } from '../lib/prisma.js';

export async function getFavorites(userId: string) {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return favorites;
  } catch (error) {
    console.error('Error fetching favorites:', error);
    throw error;
  }
}

export async function addFavorite(data: {
  userId: string;
  movieId: number;
  title: string;
  posterPath?: string;
  releaseDate?: string;
}) {
  try {
    // Verificar si ya existe
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_movieId: {
          userId: data.userId,
          movieId: data.movieId,
        },
      },
    });

    if (existing) {
      throw new Error('Movie already in favorites');
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId: data.userId,
        movieId: data.movieId,
        title: data.title,
        posterPath: data.posterPath,
        releaseDate: data.releaseDate,
      },
    });

    return favorite;
  } catch (error) {
    console.error('Error adding favorite:', error);
    throw error;
  }
}

export async function removeFavorite(userId: string, movieId: number) {
  try {
    const deleted = await prisma.favorite.delete({
      where: {
        userId_movieId: {
          userId,
          movieId,
        },
      },
    });
    return deleted;
  } catch (error) {
    console.error('Error removing favorite:', error);
    throw error;
  }
}