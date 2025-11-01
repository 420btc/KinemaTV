import { prisma } from '../lib/prisma';

export interface CreateCommentData {
  mediaId: number;
  mediaType: 'movie' | 'tv';
  username: string;
  content: string;
  title: string;
  posterPath?: string;
}

export interface Comment {
  id: string;
  mediaId: number;
  mediaType: string;
  username: string;
  content: string;
  title: string;
  posterPath: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Obtener comentarios para una película o serie específica
export async function getComments(mediaId: number, mediaType: 'movie' | 'tv'): Promise<Comment[]> {
  try {
    const comments = await prisma.comment.findMany({
      where: {
        mediaId,
        mediaType,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return comments;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw new Error('Failed to fetch comments');
  }
}

// Crear un nuevo comentario
export async function createComment(data: CreateCommentData): Promise<Comment> {
  try {
    // Validar que el contenido no esté vacío
    if (!data.content.trim()) {
      throw new Error('Comment content cannot be empty');
    }
    
    // Validar que el username no esté vacío
    if (!data.username.trim()) {
      throw new Error('Username cannot be empty');
    }
    
    // Limitar la longitud del comentario
    if (data.content.length > 1000) {
      throw new Error('Comment is too long (max 1000 characters)');
    }
    
    // Limitar la longitud del username
    if (data.username.length > 50) {
      throw new Error('Username is too long (max 50 characters)');
    }
    
    const comment = await prisma.comment.create({
      data: {
        mediaId: data.mediaId,
        mediaType: data.mediaType,
        username: data.username.trim(),
        content: data.content.trim(),
        title: data.title,
        posterPath: data.posterPath,
      },
    });
    
    return comment;
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
}

// Obtener comentarios recientes (para mostrar actividad general)
export async function getRecentComments(limit: number = 10): Promise<Comment[]> {
  try {
    const comments = await prisma.comment.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });
    
    return comments;
  } catch (error) {
    console.error('Error fetching recent comments:', error);
    throw new Error('Failed to fetch recent comments');
  }
}

// Contar comentarios para una película o serie
export async function getCommentsCount(mediaId: number, mediaType: 'movie' | 'tv'): Promise<number> {
  try {
    const count = await prisma.comment.count({
      where: {
        mediaId,
        mediaType,
      },
    });
    
    return count;
  } catch (error) {
    console.error('Error counting comments:', error);
    throw new Error('Failed to count comments');
  }
}