import { prisma } from '../lib/prisma.js';

export async function createOrUpdateUser(userData: {
  id: string;
  email: string;
  displayName?: string;
  profileImageUrl?: string;
}) {
  try {
    const user = await prisma.user.upsert({
      where: { id: userData.id },
      update: {
        email: userData.email,
        displayName: userData.displayName,
        profileImageUrl: userData.profileImageUrl,
        updatedAt: new Date(),
      },
      create: {
        id: userData.id,
        email: userData.email,
        displayName: userData.displayName,
        profileImageUrl: userData.profileImageUrl,
      },
    });

    return user;
  } catch (error) {
    console.error('Error creating/updating user:', error);
    throw error;
  }
}

export async function getUserById(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        favorites: true,
        watchlist: true,
        ratings: true,
        movieLists: {
          include: {
            items: true,
          },
        },
      },
    });

    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}