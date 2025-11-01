import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useChatContext } from '../hooks/useChatContext';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface MovieData {
  title?: string;
  release_date?: string;
  overview?: string;
  genres?: Array<{ name: string }>;
  vote_average?: number;
  poster_path?: string;
  backdrop_path?: string;
}

interface SeriesData {
  name?: string;
  first_air_date?: string;
  overview?: string;
  genres?: Array<{ name: string }>;
  vote_average?: number;
  number_of_seasons?: number;
  number_of_episodes?: number;
  poster_path?: string;
  backdrop_path?: string;
}

export const ChatPopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { contextData, updateMovieData, updateSeriesData } = useChatContext();

  // Auto-scroll al final de los mensajes
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mensaje de bienvenida inicial y carga del historial
  useEffect(() => {
    // Cargar historial del localStorage
    const savedMessages = localStorage.getItem('chatHistory');
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        setMessages(parsedMessages);
        return; // Si hay mensajes guardados, no agregar mensaje de bienvenida
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    }
    
    // Si no hay mensajes guardados, agregar mensaje de bienvenida
    const welcomeMessage: Message = {
      id: '1',
      content: '¡Hola! Soy tu asistente de películas y series. Puedo ayudarte con información sobre cualquier contenido, recomendaciones personalizadas, y responder preguntas sobre lo que estás viendo. ¿En qué puedo ayudarte?',
      isUser: false,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []); // Solo ejecutar una vez al montar el componente

  // Guardar historial cuando cambien los mensajes
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatHistory', JSON.stringify(messages));
    }
  }, [messages]);

  // Función para envío automático de mensajes
  const handleAutoSendMessage = useCallback(async (message: string, contentData: MovieData | SeriesData, contentType: string) => {
    setIsLoading(true);

    try {
      // Actualizar el contexto con los datos del contenido
      if (contentType === 'movie') {
        updateMovieData(contentData as MovieData);
      } else if (contentType === 'tv') {
        updateSeriesData(contentData as SeriesData);
      }

      // Construir el contexto con la imagen de portada
      const context = {
        currentPage: contextData.currentPage,
        movieData: contentType === 'movie' ? contentData : contextData.movieData,
        seriesData: contentType === 'tv' ? contentData : contextData.seriesData,
        conversationHistory: messages,
        contentType,
        contentData,
        imageUrl: contentData.poster_path ? `https://image.tmdb.org/t/p/w500${contentData.poster_path}` : null
      };

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message, 
          context 
        }),
      });

      if (!response.ok) {
        throw new Error('Error al enviar mensaje');
      }

      const data = await response.json();
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Lo siento, hubo un error al procesar tu mensaje.',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [contextData, messages]);

  // Escuchar eventos de "Enviar al Chat"
  useEffect(() => {
    const handleSendToChat = (event: CustomEvent) => {
      const { message, contentData, contentType } = event.detail;
      
      // Abrir el chat si está cerrado
      setIsOpen(true);
      
      // Agregar el mensaje al chat
      const chatMessage: Message = {
        id: Date.now().toString(),
        content: message,
        isUser: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, chatMessage]);
      
      // Enviar automáticamente el mensaje al servicio de chat
      setTimeout(() => {
        handleAutoSendMessage(message, contentData, contentType);
      }, 500);
    };

    window.addEventListener('sendToChat', handleSendToChat as EventListener);
    
    return () => {
      window.removeEventListener('sendToChat', handleSendToChat as EventListener);
    };
  }, [handleAutoSendMessage]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Aquí llamaremos al servicio de chat
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputValue,
          context: {
            currentPage: contextData.currentPage,
            movieData: contextData.movieData,
            seriesData: contextData.seriesData,
            conversationHistory: messages.slice(-10) // Últimos 10 mensajes para contexto
          }
        })
      });

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response || 'Lo siento, hubo un error al procesar tu mensaje.',
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Lo siento, hubo un error al conectar con el asistente. Por favor, inténtalo de nuevo.',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChatHistory = () => {
    setMessages([]);
    localStorage.removeItem('chatHistory');
    // Agregar mensaje de bienvenida después de limpiar
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      content: '¡Hola! Soy tu asistente de películas y series. El historial ha sido limpiado. ¿En qué puedo ayudarte?',
      isUser: false,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Botón flotante */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-orange-400 to-yellow-400 text-black p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 animate-pulse"
          aria-label="Abrir chat"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      )}

      {/* Ventana del chat */}
      {isOpen && (
        <div className="bg-[#1A2233] border border-[#2A3441] rounded-lg shadow-2xl w-80 h-96 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-400 to-yellow-400 text-black p-3 flex justify-between items-center">
            <h3 className="font-semibold text-sm">Asistente de Películas</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={clearChatHistory}
                className="hover:bg-black/10 rounded p-1 transition-colors"
                title="Limpiar historial"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-black/10 rounded p-1 transition-colors"
                aria-label="Cerrar chat"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-2 rounded-lg text-sm ${
                    message.isUser
                      ? 'bg-gradient-to-r from-orange-400 to-yellow-400 text-black'
                      : 'bg-[#2A3441] text-slate-100'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-[#2A3441] text-slate-100 p-2 rounded-lg text-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-[#2A3441]">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu mensaje..."
                className="flex-1 bg-[#2A3441] text-slate-100 text-sm px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="bg-gradient-to-r from-orange-400 to-yellow-400 text-black px-3 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};