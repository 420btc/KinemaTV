import { useState, useEffect, useCallback } from 'react';
import { getComments, createComment, getCommentsCount, type Comment, type CreateCommentData } from '../api/comments';

interface UseCommentsProps {
  mediaId: number;
  mediaType: 'movie' | 'tv';
}

interface UseCommentsReturn {
  comments: Comment[];
  commentsCount: number;
  loading: boolean;
  submitting: boolean;
  error: string | null;
  addComment: (data: Omit<CreateCommentData, 'mediaId' | 'mediaType'>) => Promise<void>;
  refreshComments: () => Promise<void>;
}

export function useComments({ mediaId, mediaType }: UseCommentsProps): UseCommentsReturn {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsCount, setCommentsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadComments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [fetchedComments, count] = await Promise.all([
        getComments(mediaId, mediaType),
        getCommentsCount(mediaId, mediaType)
      ]);
      setComments(fetchedComments);
      setCommentsCount(count);
    } catch (err: unknown) {
      console.error('Error loading comments:', err);
      setError('Error al cargar los comentarios');
    } finally {
      setLoading(false);
    }
  }, [mediaId, mediaType]);

  const addComment = useCallback(async (data: Omit<CreateCommentData, 'mediaId' | 'mediaType'>) => {
    try {
      setSubmitting(true);
      setError(null);
      
      const commentData: CreateCommentData = {
        ...data,
        mediaId,
        mediaType,
      };

      await createComment(commentData);
      
      // Recargar comentarios después de agregar uno nuevo
      await loadComments();
      
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al enviar el comentario');
      throw err; // Re-throw para que el componente pueda manejar el error
    } finally {
      setSubmitting(false);
    }
  }, [mediaId, mediaType, loadComments]);

  const refreshComments = useCallback(async () => {
    await loadComments();
  }, [loadComments]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  return {
    comments,
    commentsCount,
    loading,
    submitting,
    error,
    addComment,
    refreshComments,
  };
}