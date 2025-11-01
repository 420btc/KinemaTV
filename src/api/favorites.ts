import { prisma } from '../lib/prisma.js';

export async function getFavorites(userId: string) {
  try {
    const favorites = await prisma.favorite.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return favorites;
  } catch (error) {
    console.error('Error fetching favorites:', error);
    throw error;
  }
}

export async function addFavorite(data: {
  userId: string;
  mediaId: number;
  mediaType: string;
  title: string;
  posterPath?: string;
}) {
  try {
    // Verificar si ya existe
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_mediaId_mediaType: {
          userId: data.userId,
          mediaId: data.mediaId,
          mediaType: data.mediaType,
        },
      },
    });

    if (existing) {
      throw new Error('Media already in favorites');
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId: data.userId,
        mediaId: data.mediaId,
        mediaType: data.mediaType,
        title: data.title,
        posterPath: data.posterPath,
      },
    });

    return favorite;
  } catch (error) {
    console.error('Error adding favorite:', error);
    throw error;
  }
}

export async function removeFavorite(userId: string, mediaId: number, mediaType: string) {
  try {
    const deleted = await prisma.favorite.delete({
      where: {
        userId_mediaId_mediaType: {
          userId,
          mediaId,
          mediaType,
        },
      },
    });
    return deleted;
  } catch (error) {
    console.error('Error removing favorite:', error);
    throw error;
  }
}