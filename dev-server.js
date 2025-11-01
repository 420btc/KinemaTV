import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Importar las funciones serverless
let commentsHandler;
let seriesAnalysisHandler;
let movieAnalysisHandler;
let actorDetailsHandler;

async function loadCommentsHandler() {
  try {
    const module = await import('./api/comments.js');
    commentsHandler = module.default;
    console.log('✅ Comments handler loaded successfully');
  } catch (error) {
    console.error('❌ Error loading comments handler:', error);
  }
}

async function loadSeriesAnalysisHandler() {
  try {
    const module = await import('./api/series-analysis.js');
    seriesAnalysisHandler = module.default;
    console.log('✅ Series analysis handler loaded successfully');
  } catch (error) {
    console.error('❌ Error loading series analysis handler:', error);
  }
}

async function loadMovieAnalysisHandler() {
  try {
    const module = await import('./api/movie-analysis.js');
    movieAnalysisHandler = module.default;
    console.log('✅ Movie analysis handler loaded successfully');
  } catch (error) {
    console.error('❌ Error loading movie analysis handler:', error);
  }
}

async function loadActorDetailsHandler() {
  try {
    const module = await import('./api/actor-details.js');
    actorDetailsHandler = module.default;
    console.log('✅ Actor details handler loaded successfully');
  } catch (error) {
    console.error('❌ Error loading actor details handler:', error);
  }
}

// Middleware para simular el entorno de Vercel
function createVercelRequest(req) {
  return {
    method: req.method,
    url: req.url,
    query: req.query,
    body: req.body,
    headers: req.headers
  };
}

function createVercelResponse(res) {
  return {
    status: (code) => ({
      json: (data) => res.status(code).json(data),
      end: () => res.status(code).end()
    }),
    json: (data) => res.json(data),
    setHeader: (name, value) => res.setHeader(name, value),
    end: () => res.end()
  };
}

// Ruta para comentarios
app.all('/api/comments', async (req, res) => {
  try {
    if (!commentsHandler) {
      return res.status(500).json({ error: 'Comments handler not loaded' });
    }

    const vercelReq = createVercelRequest(req);
    const vercelRes = createVercelResponse(res);
    
    await commentsHandler(vercelReq, vercelRes);
  } catch (error) {
    console.error('Error in comments API:', error);
    res.status(500).json({ error: error.message });
  }
});

// Ruta para análisis de series
app.all('/api/series-analysis', async (req, res) => {
  try {
    if (!seriesAnalysisHandler) {
      return res.status(500).json({ error: 'Series analysis handler not loaded' });
    }

    const vercelReq = createVercelRequest(req);
    const vercelRes = createVercelResponse(res);
    
    await seriesAnalysisHandler(vercelReq, vercelRes);
  } catch (error) {
    console.error('Error in series analysis API:', error);
    res.status(500).json({ error: error.message });
  }
});

// Ruta para análisis de películas
app.all('/api/movie-analysis', async (req, res) => {
  try {
    if (!movieAnalysisHandler) {
      return res.status(500).json({ error: 'Movie analysis handler not loaded' });
    }

    const vercelReq = createVercelRequest(req);
    const vercelRes = createVercelResponse(res);
    
    await movieAnalysisHandler(vercelReq, vercelRes);
  } catch (error) {
    console.error('Error in movie analysis API:', error);
    res.status(500).json({ error: error.message });
  }
});

// Ruta para detalles de actores
app.all('/api/actor-details', async (req, res) => {
  try {
    if (!actorDetailsHandler) {
      return res.status(500).json({ error: 'Actor details handler not loaded' });
    }

    const vercelReq = createVercelRequest(req);
    const vercelRes = createVercelResponse(res);
    
    await actorDetailsHandler(vercelReq, vercelRes);
  } catch (error) {
    console.error('Error in actor details API:', error);
    res.status(500).json({ error: error.message });
  }
});

// Ruta de salud
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Dev server running' });
});

// Inicializar y arrancar servidor
Promise.all([
  loadCommentsHandler(),
  loadSeriesAnalysisHandler(),
  loadMovieAnalysisHandler(),
  loadActorDetailsHandler()
]).then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Dev server running on http://localhost:${PORT}`);
    console.log(`📝 Comments API available at http://localhost:${PORT}/api/comments`);
    console.log(`🎬 Series Analysis API available at http://localhost:${PORT}/api/series-analysis`);
    console.log(`🎭 Movie Analysis API available at http://localhost:${PORT}/api/movie-analysis`);
    console.log(`👤 Actor Details API available at http://localhost:${PORT}/api/actor-details`);
  });
}).catch(error => {
  console.error('Failed to start server:', error);
});