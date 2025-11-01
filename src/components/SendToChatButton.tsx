import React from 'react';
import { motion } from 'framer-motion';

interface MovieData {
  id: number;
  title: string;
  overview: string;
  poster_path?: string | null;
  release_date?: string;
  vote_average: number;
  genres: { id: number; name: string }[];
}

interface SeriesData {
  id: number;
  name: string;
  overview: string;
  poster_path?: string | null;
  first_air_date?: string;
  vote_average: number;
  genres: { id: number; name: string }[];
  number_of_seasons?: number;
  number_of_episodes?: number;
}

interface SendToChatButtonProps {
  movie?: MovieData;
  series?: SeriesData;
  type: 'movie' | 'tv';
}

export const SendToChatButton: React.FC<SendToChatButtonProps> = ({ movie, series, type }) => {
  const handleSendToChat = () => {
    const content = movie || series;
    if (!content) return;

    const title = type === 'movie' ? (movie?.title || '') : (series?.name || '');
    const posterUrl = content.poster_path 
      ? `https://image.tmdb.org/t/p/w300${content.poster_path}`
      : null;
    
    const releaseInfo = type === 'movie' 
      ? movie?.release_date 
      : series?.first_air_date;
    
    const genres = content.genres?.map(g => g.name).join(', ') || '';
    
    // Crear mensaje con información del contenido
    const messageContent = `📺 **${title}**

${posterUrl || ''}

**Información:**
- ${type === 'movie' ? 'Fecha de estreno' : 'Primera emisión'}: ${releaseInfo || 'No disponible'}
- Géneros: ${genres}
- Puntuación: ⭐ ${content.vote_average.toFixed(1)}/10
${type === 'tv' && series?.number_of_seasons ? `- Temporadas: ${series.number_of_seasons}` : ''}
${type === 'tv' && series?.number_of_episodes ? `- Episodios: ${series.number_of_episodes}` : ''}

**Sinopsis:**
${content.overview || 'No hay sinopsis disponible.'}

¿Qué te gustaría saber sobre esta ${type === 'movie' ? 'película' : 'serie'}?`;

    // Crear evento personalizado para enviar al chat
    const chatEvent = new CustomEvent('sendToChat', {
      detail: {
        message: messageContent,
        contentData: content,
        contentType: type
      }
    });
    
    window.dispatchEvent(chatEvent);
  };

  return (
    <motion.button
      onClick={handleSendToChat}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 
                 text-black rounded-full text-sm font-medium hover:from-yellow-500 hover:to-yellow-600 
                 transition-all duration-200 shadow-lg hover:shadow-xl"
      title="Enviar al chat para análisis con IA"
    >
      <svg 
        className="w-4 h-4" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
        />
      </svg>
      Enviar al Chat
    </motion.button>
  );
};