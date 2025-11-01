import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Importaciones dinámicas para las funciones de API
let userAPI, favoritesAPI, watchlistAPI, movieAnalysisAPI, chatAPI;

async function initializeAPIs() {
  try {
    const userModule = await import('../src/api/user.ts');
    const favoritesModule = await import('../src/api/favorites.ts');
    const watchlistModule = await import('../src/api/watchlist.ts');
    const movieAnalysisModule = await import('../src/api/movie-analysis.ts');
    const chatModule = await import('../src/api/chat.ts');
    
    userAPI = userModule;
    favoritesAPI = favoritesModule;
    watchlistAPI = watchlistModule;
    movieAnalysisAPI = movieAnalysisModule;
    chatAPI = chatModule;
  } catch (error) {
    console.error('Error loading API modules:', error);
  }
}

// User routes
app.post('/api/user', async (req, res) => {
  try {
    const user = await userAPI.createOrUpdateUser(req.body);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/user/:id', async (req, res) => {
  try {
    const user = await userAPI.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Favorites routes
app.get('/api/favorites/:userId', async (req, res) => {
  try {
    const favorites = await favoritesAPI.getFavorites(req.params.userId);
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/favorites', async (req, res) => {
  try {
    const favorite = await favoritesAPI.addFavorite(req.body);
    res.json(favorite);
  } catch (error) {
    if (error.message === 'Movie already in favorites') {
      return res.status(409).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/favorites/:userId/:movieId', async (req, res) => {
  try {
    const { userId, movieId } = req.params;
    await favoritesAPI.removeFavorite(userId, parseInt(movieId));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Watchlist routes
app.get('/api/watchlist/:userId', async (req, res) => {
  try {
    const watchlist = await watchlistAPI.getWatchlist(req.params.userId);
    res.json(watchlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/watchlist', async (req, res) => {
  try {
    const watchlistItem = await watchlistAPI.addToWatchlist(req.body);
    res.json(watchlistItem);
  } catch (error) {
    if (error.message === 'Movie already in watchlist') {
      return res.status(409).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/watchlist/:userId/:movieId', async (req, res) => {
  try {
    const { userId, movieId } = req.params;
    await watchlistAPI.removeFromWatchlist(userId, parseInt(movieId));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Movie Analysis routes
app.post('/api/movie-analysis', async (req, res) => {
  try {
    const { movieTitle, movieYear, movieGenres } = req.body;
    
    if (!movieTitle) {
      return res.status(400).json({ error: 'Movie title is required' });
    }
    
    // Usar año actual si no se proporciona
    const releaseYear = movieYear || new Date().getFullYear();
    
    const analysis = await movieAnalysisAPI.handleMovieAnalysis({
      movieTitle,
      releaseYear
    });
    res.json(analysis);
  } catch (error) {
    console.error('Movie analysis error:', error);
    res.status(500).json({ error: 'Error analyzing movie' });
  }
});

// Series Analysis route
app.post('/api/series-analysis', async (req, res) => {
  try {
    const { seriesTitle, seriesYear, seriesGenres } = req.body;
    
    if (!seriesTitle) {
      return res.status(400).json({ error: 'Series title is required' });
    }
    
    // Usar año actual si no se proporciona
    const releaseYear = seriesYear || new Date().getFullYear();
    
    const analysis = await movieAnalysisAPI.handleSeriesAnalysis({
      seriesTitle,
      releaseYear
    });
    res.json(analysis);
  } catch (error) {
    console.error('Series analysis error:', error);
    res.status(500).json({ error: 'Error analyzing series' });
  }
});

app.post('/api/actor-details', async (req, res) => {
  try {
    const { actorName } = req.body;
    
    if (!actorName) {
      return res.status(400).json({ error: 'Actor name is required' });
    }
    
    const details = await movieAnalysisAPI.handleActorDetails(actorName);
    res.json(details);
  } catch (error) {
    console.error('Actor details error:', error);
    res.status(500).json({ error: 'Error fetching actor details' });
  }
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, context } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const response = await chatAPI.getChatResponse(message, context || {});
    res.json({ response });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({ error: error.message });
  }
});

// Recommendations endpoint
app.post('/api/recommendations', async (req, res) => {
  try {
    const { contentType, contentData } = req.body;
    
    if (!contentType || !contentData) {
      return res.status(400).json({ error: 'Content type and data are required' });
    }

    const recommendations = await chatAPI.getRecommendations(contentType, contentData);
    res.json({ recommendations });
  } catch (error) {
    console.error('Error getting recommendations:', error);
    res.status(500).json({ error: error.message });
  }
});

// Inicializar APIs y luego iniciar el servidor
initializeAPIs().then(() => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}`);
  });
}).catch(error => {
  console.error('Failed to initialize server:', error);
});