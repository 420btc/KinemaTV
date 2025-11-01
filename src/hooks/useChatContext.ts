import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

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

interface ChatContextData {
  currentPage: string;
  movieData?: MovieData;
  seriesData?: SeriesData;
  pageTitle?: string;
}

export const useChatContext = () => {
  const location = useLocation();
  const [contextData, setContextData] = useState<ChatContextData>({
    currentPage: location.pathname
  });

  useEffect(() => {
    const updateContext = () => {
      const newContext: ChatContextData = {
        currentPage: location.pathname
      };

      // Detectar tipo de página y obtener datos si están disponibles
      if (location.pathname.includes('/movie/')) {
        newContext.pageTitle = 'Detalles de Película';
        // Intentar obtener datos de película del DOM o estado global si están disponibles
        const movieTitle = document.querySelector('h1')?.textContent;
        if (movieTitle) {
          newContext.movieData = { title: movieTitle };
        }
      } else if (location.pathname.includes('/tv/')) {
        newContext.pageTitle = 'Detalles de Serie';
        // Intentar obtener datos de serie del DOM o estado global si están disponibles
        const seriesTitle = document.querySelector('h1')?.textContent;
        if (seriesTitle) {
          newContext.seriesData = { name: seriesTitle };
        }
      } else if (location.pathname === '/') {
        newContext.pageTitle = 'Página de Inicio';
      } else if (location.pathname === '/search') {
        newContext.pageTitle = 'Búsqueda';
      } else if (location.pathname === '/explore') {
        newContext.pageTitle = 'Explorar';
      } else if (location.pathname === '/favorites') {
        newContext.pageTitle = 'Favoritos';
      } else if (location.pathname === '/watchlist') {
        newContext.pageTitle = 'Lista de Seguimiento';
      } else if (location.pathname === '/tierlist') {
        newContext.pageTitle = 'Tier List';
      }

      setContextData(newContext);
    };

    updateContext();
    
    // Actualizar contexto cuando cambie la ruta
    const timer = setTimeout(updateContext, 1000); // Dar tiempo para que se cargue el contenido
    
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const updateMovieData = (movieData: MovieData) => {
    setContextData(prev => ({
      ...prev,
      movieData
    }));
  };

  const updateSeriesData = (seriesData: SeriesData) => {
    setContextData(prev => ({
      ...prev,
      seriesData
    }));
  };

  return {
    contextData,
    updateMovieData,
    updateSeriesData
  };
};