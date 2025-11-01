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
  mediaId: number;
  mediaType: string;
  title: string;
  posterPath?: string;
}) {
  try {
    // Verificar si ya existe
    const existing = await prisma.watchlist.findUnique({
      where: {
        userId_mediaId_mediaType: {
          userId: data.userId,
          mediaId: data.mediaId,
          mediaType: data.mediaType,
        },
      },
    });

    if (existing) {
      throw new Error('Media already in watchlist');
    }

    const watchlistItem = await prisma.watchlist.create({
      data: {
        userId: data.userId,
        mediaId: data.mediaId,
        mediaType: data.mediaType,
        title: data.title,
        posterPath: data.posterPath,
      },
    });

    return watchlistItem;
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    throw error;
  }
}

export async function removeFromWatchlist(userId: string, mediaId: number, mediaType: string) {
  try {
    const deleted = await prisma.watchlist.delete({
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
    console.error('Error removing from watchlist:', error);
    throw error;
  }
}