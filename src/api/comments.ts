// Frontend API client for comments - uses HTTP requests instead of direct Prisma

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

const API_BASE_URL = import.meta.env.VITE_API_URL || (
  import.meta.env.PROD 
    ? '' // En Vercel, usa la misma URL base (relativa)
    : 'http://localhost:3001'
);

// Obtener comentarios para una película o serie específica
export async function getComments(mediaId: number, mediaType: 'movie' | 'tv'): Promise<Comment[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/comments?mediaId=${mediaId}&mediaType=${mediaType}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText || response.statusText}`);
    }
    
    const comments = await response.json();
    
    // Convertir strings de fecha a objetos Date
    return comments.map((comment: Comment) => ({
      ...comment,
      createdAt: new Date(comment.createdAt),
      updatedAt: new Date(comment.updatedAt),
    }));
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error; // Re-throw para que el hook pueda capturar el error
  }
}

// Crear un nuevo comentario
export async function createComment(data: CreateCommentData): Promise<Comment> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const comment = await response.json();
    return {
      ...comment,
      createdAt: new Date(comment.createdAt),
      updatedAt: new Date(comment.updatedAt)
    };
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
}

// Obtener comentarios recientes (para mostrar actividad general)
export async function getRecentComments(limit: number = 10): Promise<Comment[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/comments?action=recent&limit=${limit}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const comments = await response.json();
    
    // Convertir strings de fecha a objetos Date
    return comments.map((comment: Comment) => ({
      ...comment,
      createdAt: new Date(comment.createdAt),
      updatedAt: new Date(comment.updatedAt),
    }));
  } catch (error) {
    console.error('Error fetching recent comments:', error);
    return [];
  }
}

// Contar comentarios para una película o serie
export async function getCommentsCount(mediaId: number, mediaType: 'movie' | 'tv'): Promise<number> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/comments?action=count&mediaId=${mediaId}&mediaType=${mediaType}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText || response.statusText}`);
    }
    
    const data = await response.json();
    return data.count;
  } catch (error) {
    console.error('Error counting comments:', error);
    throw error; // Re-throw para que el hook pueda capturar el error
  }
}