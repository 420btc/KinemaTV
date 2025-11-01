import React, { useState, useEffect } from 'react';
import { getComments, createComment, getCommentsCount, type Comment, type CreateCommentData } from '../api/comments';

interface CommentsSectionProps {
  mediaId: number;
  mediaType: 'movie' | 'tv';
  title: string;
  posterPath?: string;
}

export default function CommentsSection({ mediaId, mediaType, title, posterPath }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsCount, setCommentsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    content: ''
  });
  const [error, setError] = useState<string | null>(null);

  // Cargar comentarios al montar el componente
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const fetchedComments = await getComments(mediaId, mediaType);
        setComments(fetchedComments);
      } catch (err) {
        console.error('Error loading comments:', err);
        setError('Error al cargar los comentarios');
      } finally {
        setLoading(false);
      }
    };

    const loadCount = async () => {
      try {
        const count = await getCommentsCount(mediaId, mediaType);
        setCommentsCount(count);
      } catch (err) {
        console.error('Error loading comments count:', err);
      }
    };

    loadData();
    loadCount();
  }, [mediaId, mediaType]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const fetchedComments = await getComments(mediaId, mediaType);
      setComments(fetchedComments);
    } catch (err) {
      console.error('Error loading comments:', err);
      setError('Error al cargar los comentarios');
    } finally {
      setLoading(false);
    }
  };

  const loadCommentsCount = async () => {
    try {
      const count = await getCommentsCount(mediaId, mediaType);
      setCommentsCount(count);
    } catch (err) {
      console.error('Error loading comments count:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username.trim() || !formData.content.trim()) {
      setError('Por favor completa todos los campos');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      
      const commentData: CreateCommentData = {
        mediaId,
        mediaType,
        username: formData.username,
        content: formData.content,
        title,
        posterPath
      };

      await createComment(commentData);
      
      // Limpiar formulario
      setFormData({ username: '', content: '' });
      setShowForm(false);
      
      // Recargar comentarios
      await loadComments();
      await loadCommentsCount();
      
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al enviar el comentario');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="backdrop-blur-md bg-white/20 dark:bg-gray-900/20 border border-white/30 dark:border-gray-700/30 rounded-lg shadow-xl p-2 sm:p-6 mt-8 relative z-20 comments-section w-full max-w-none sm:max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-6 gap-3 sm:gap-0 mobile-spacing px-2 sm:px-0">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white drop-shadow-lg">
          Comentarios ({commentsCount})
        </h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600/80 hover:bg-blue-700/90 active:bg-blue-800/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg transition-all duration-200 border border-blue-500/30 text-sm sm:text-base w-full sm:w-auto touch-manipulation"
        >
          {showForm ? 'Cancelar' : 'Agregar Comentario'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-4 sm:mb-6 px-2 sm:px-0">
          <div className="space-y-3 sm:space-y-4">
            <input
              type="text"
              placeholder="Tu nombre"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 dark:bg-gray-800/50 border border-white/20 dark:border-gray-600/50 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent text-base touch-manipulation"
              required
            />
            <textarea
              placeholder="Escribe tu comentario..."
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 dark:bg-gray-800/50 border border-white/20 dark:border-gray-600/50 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent resize-none text-base touch-manipulation"
              rows={3}
              maxLength={500}
              required
            />
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-right">
              {formData.content.length}/500 caracteres
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-3 sm:mt-4">
            <button
              type="submit"
              disabled={submitting}
              className="bg-green-600/80 hover:bg-green-700/90 active:bg-green-800/90 disabled:bg-gray-500/50 backdrop-blur-sm text-white px-4 py-2 rounded-lg transition-all duration-200 border border-green-500/30 text-sm sm:text-base w-full sm:w-auto touch-manipulation"
            >
              {submitting ? 'Enviando...' : 'Enviar Comentario'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-gray-600/80 hover:bg-gray-700/90 active:bg-gray-700 backdrop-blur-sm text-white px-4 py-2 rounded-lg transition-all duration-200 border border-gray-500/30 text-sm sm:text-base w-full sm:w-auto touch-manipulation"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Mostrar errores de carga */}
      {error && (
        <div className="backdrop-blur-sm bg-red-50/50 dark:bg-red-900/30 border border-red-200/50 dark:border-red-800/50 rounded-lg p-3 sm:p-4 mb-4 px-2 sm:px-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center flex-shrink-0">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200 drop-shadow">
                  Error al cargar comentarios
                </h3>
              </div>
            </div>
            <div className="flex-1">
              <div className="text-sm text-red-700 dark:text-red-300">
                <p>{error}</p>
              </div>
              <div className="mt-2 sm:mt-3">
                <button
                  onClick={() => {
                    setError(null);
                    loadComments();
                    loadCommentsCount();
                  }}
                  className="backdrop-blur-sm bg-red-100/60 hover:bg-red-200/70 active:bg-red-300/70 dark:bg-red-800/60 dark:hover:bg-red-700/70 dark:active:bg-red-600/70 text-red-800 dark:text-red-200 px-3 py-1 rounded text-sm font-medium border border-red-300/50 dark:border-red-600/50 transition-all duration-200 w-full sm:w-auto touch-manipulation"
                >
                  Reintentar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lista de comentarios */}
      <div className="space-y-3 sm:space-y-4 px-2 sm:px-0">
        {loading ? (
          <div className="text-center py-6 sm:py-8">
            <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm sm:text-base">Cargando comentarios...</p>
          </div>
        ) : error ? (
          <div className="text-center py-6 sm:py-8">
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
              No se pudieron cargar los comentarios debido a un error.
            </p>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-6 sm:py-8">
            <p className="text-gray-600 dark:text-gray-400 drop-shadow text-sm sm:text-base">
              No hay comentarios aún. ¡Sé el primero en comentar!
            </p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="backdrop-blur-sm bg-white/10 dark:bg-gray-800/30 border border-white/20 dark:border-gray-600/30 rounded-lg p-3 sm:p-4 shadow-lg">
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm flex-shrink-0">
                  {comment.username.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
                    <span className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base drop-shadow">
                      {comment.username}
                    </span>
                    <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 ml-0 sm:ml-2">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-gray-800 dark:text-gray-200 text-sm sm:text-base leading-relaxed drop-shadow-sm">
                    {comment.content}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}