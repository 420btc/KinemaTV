import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Importar la función serverless de comentarios
let commentsHandler;
let seriesAnalysisHandler;

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
      json: (data) => res.status(code).json(data)
    }),
    json: (data) => res.json(data)
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

// Ruta de salud
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Dev server running' });
});

// Inicializar y arrancar servidor
Promise.all([
  loadCommentsHandler(),
  loadSeriesAnalysisHandler()
]).then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Dev server running on http://localhost:${PORT}`);
    console.log(`📝 Comments API available at http://localhost:${PORT}/api/comments`);
    console.log(`🎬 Series Analysis API available at http://localhost:${PORT}/api/series-analysis`);
  });
}).catch(error => {
  console.error('Failed to start server:', error);
});