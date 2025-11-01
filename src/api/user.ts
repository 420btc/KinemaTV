import { prisma } from '../lib/prisma.js';

export async function createOrUpdateUser(userData: {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
}) {
  try {
    const user = await prisma.user.upsert({
      where: { id: userData.id },
      update: {
        email: userData.email,
        name: userData.name,
        avatar: userData.avatar,
        updatedAt: new Date(),
      },
      create: {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        avatar: userData.avatar,
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
        lists: {
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