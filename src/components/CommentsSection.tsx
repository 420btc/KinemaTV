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
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 mt-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          Comentarios ({commentsCount})
        </h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
        >
          {showForm ? 'Cancelar' : 'Agregar Comentario'}
        </button>
      </div>

      {/* Formulario para agregar comentario */}
      {showForm && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nombre de usuario
              </label>
              <input
                type="text"
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Ingresa tu nombre"
                maxLength={50}
                required
              />
            </div>
            
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Comentario
              </label>
              <textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Escribe tu comentario..."
                rows={4}
                maxLength={1000}
                required
              />
              <div className="text-sm text-gray-500 mt-1">
                {formData.content.length}/1000 caracteres
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded">
                {error}
              </div>
            )}

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={submitting}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors duration-200"
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

      {/* Lista de comentarios */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Cargando comentarios...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">
              No hay comentarios aún. ¡Sé el primero en comentar!
            </p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border-l-4 border-blue-500">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {comment.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {comment.username}
                  </span>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(comment.createdAt)}
                </span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {comment.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}