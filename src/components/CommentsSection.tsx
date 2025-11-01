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
    <div className="backdrop-blur-md bg-white/20 dark:bg-gray-900/20 border border-white/30 dark:border-gray-700/30 rounded-lg shadow-xl p-6 mt-8 relative z-20">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white drop-shadow-lg">
          Comentarios ({commentsCount})
        </h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600/80 hover:bg-blue-700/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg transition-all duration-200 border border-blue-500/30"
        >
          {showForm ? 'Cancelar' : 'Agregar Comentario'}
        </button>
      </div>

      {/* Formulario para agregar comentario */}
      {showForm && (
        <div className="backdrop-blur-sm bg-gray-50/30 dark:bg-gray-800/30 border border-gray-200/50 dark:border-gray-600/50 rounded-lg p-4 mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 drop-shadow">
                Nombre de usuario
              </label>
              <input
                type="text"
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300/50 dark:border-gray-600/50 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm bg-white/50 dark:bg-gray-700/50 dark:text-white"
                placeholder="Ingresa tu nombre"
                maxLength={50}
                required
              />
            </div>
            
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 drop-shadow">
                Comentario
              </label>
              <textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300/50 dark:border-gray-600/50 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm bg-white/50 dark:bg-gray-700/50 dark:text-white"
                placeholder="Escribe tu comentario..."
                rows={4}
                maxLength={1000}
                required
              />
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 drop-shadow">
                {formData.content.length}/1000 caracteres
              </div>
            </div>

            {error && (
              <div className="text-red-600 dark:text-red-400 text-sm backdrop-blur-sm bg-red-50/50 dark:bg-red-900/30 border border-red-200/50 dark:border-red-700/50 p-2 rounded">
                {error}
              </div>
            )}

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={submitting}
                className="bg-green-600/80 hover:bg-green-700/90 disabled:bg-gray-400/60 backdrop-blur-sm text-white px-4 py-2 rounded-lg transition-all duration-200 border border-green-500/30"
              >
                {submitting ? 'Enviando...' : 'Enviar Comentario'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Mostrar errores de carga */}
      {error && (
        <div className="backdrop-blur-sm bg-red-50/50 dark:bg-red-900/30 border border-red-200/50 dark:border-red-800/50 rounded-lg p-4 mb-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200 drop-shadow">
                Error al cargar comentarios
              </h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                <p>{error}</p>
              </div>
              <div className="mt-3">
                <button
                  onClick={() => {
                    setError(null);
                    loadComments();
                    loadCommentsCount();
                  }}
                  className="backdrop-blur-sm bg-red-100/60 hover:bg-red-200/70 dark:bg-red-800/60 dark:hover:bg-red-700/70 text-red-800 dark:text-red-200 px-3 py-1 rounded text-sm font-medium border border-red-300/50 dark:border-red-600/50 transition-all duration-200"
                >
                  Reintentar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lista de comentarios */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Cargando comentarios...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">
              No se pudieron cargar los comentarios debido a un error.
            </p>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400 drop-shadow">
              No hay comentarios aún. ¡Sé el primero en comentar!
            </p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="backdrop-blur-sm bg-gray-50/30 dark:bg-gray-800/30 border border-gray-200/50 dark:border-gray-600/50 rounded-lg p-4 border-l-4 border-l-blue-500/80">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-600/80 backdrop-blur-sm rounded-full flex items-center justify-center border border-blue-500/30">
                    <span className="text-white text-sm font-bold drop-shadow">
                      {comment.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white drop-shadow">
                    {comment.username}
                  </span>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400 drop-shadow">
                  {formatDate(comment.createdAt)}
                </span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed drop-shadow">
                {comment.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}