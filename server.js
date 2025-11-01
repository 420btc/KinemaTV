import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Importaciones dinámicas para las funciones de API
let userAPI, favoritesAPI, watchlistAPI;

async function initializeAPIs() {
  try {
    const userModule = await import('./src/api/user.ts');
    const favoritesModule = await import('./src/api/favorites.ts');
    const watchlistModule = await import('./src/api/watchlist.ts');
    
    userAPI = userModule;
    favoritesAPI = favoritesModule;
    watchlistAPI = watchlistModule;
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

// Inicializar APIs y luego iniciar el servidor
initializeAPIs().then(() => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}`);
  });
}).catch(error => {
  console.error('Failed to initialize server:', error);
});