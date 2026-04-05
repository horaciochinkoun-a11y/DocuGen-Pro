import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { existsSync, readdirSync } from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Request logger for debugging production issues
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  }
  next();
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const clientPath = path.join(__dirname, 'client');
  console.log(`Configuring static files from: ${clientPath}`);
  
  app.use(express.static(clientPath));
  
  // SPA Fallback: handle all GET requests that don't match a static file or API
  app.get('*all', (req, res, next) => {
    // If it's an API request that reached here, it's a 404 for the API
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(clientPath, 'index.html'));
  });
}

// Custom 404 handler for API routes to ensure JSON response
app.use('/api', (req, res) => {
  res.status(404).json({ error: `Route API non trouvée : ${req.method} ${req.path}` });
});

// Global error handler to ensure JSON response for API errors
app.use((err: Error & { status?: number }, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled Error:', err);
  if (req.path.startsWith('/api') || req.headers.accept?.includes('application/json')) {
    return res.status(err.status || 500).json({
      error: err.message || 'Une erreur interne du serveur s\'est produite.',
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
  next(err);
});

// In dev, run on 3001 so Vite can proxy from 3000
const ACTUAL_PORT = process.env.NODE_ENV === 'production' ? 3000 : 3001;

console.log(`Starting server in ${process.env.NODE_ENV || 'development'} mode...`);
console.log(`__dirname: ${__dirname}`);
const clientPath = path.join(__dirname, 'client');
console.log(`clientPath: ${clientPath}`);

// Check if clientPath exists
if (existsSync(clientPath)) {
  console.log(`clientPath exists. Contents: ${readdirSync(clientPath).join(', ')}`);
} else {
  console.log(`WARNING: clientPath does not exist: ${clientPath}`);
}

app.listen(ACTUAL_PORT, '0.0.0.0', () => {
  console.log(`Server listening on 0.0.0.0:${ACTUAL_PORT}`);
  if (process.env.NODE_ENV === 'production') {
    console.log('Production mode: serving static files enabled.');
  }
});
