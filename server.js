// ============================================
// Review Funnel SaaS — Express Server
// ============================================

const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');

const app = express();

// ---------- Middleware ----------

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// CORS — restrict to allowed origins in production
app.use(
  cors({
    origin: config.nodeEnv === 'production' ? config.cors.origins : '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Request logger
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// ---------- Routes ----------

app.use('/api', routes);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// 404 catch-all
app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// Global error handler
app.use((err, _req, res, _next) => {
  console.error('[FATAL]', err);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

// ---------- Start ----------

const HOST = '0.0.0.0';

app.listen(config.port, HOST, () => {
  console.log('');
  console.log('============================================');
  console.log('  Review Funnel SaaS — Server Running');
  console.log(`  Host:        ${HOST}`);
  console.log(`  Port:        ${config.port}`);
  console.log(`  Environment: ${config.nodeEnv}`);
  console.log(`  API Base:    http://localhost:${config.port}/api`);
  console.log('============================================');
  console.log('');
  console.log('Endpoints:');
  console.log(`  POST /api/generate-review`);
  console.log(`  POST /api/feedback`);
  console.log(`  POST /api/track-scan`);
  console.log(`  GET  /api/dashboard/:clientId`);
  console.log(`  GET  /health`);
  console.log('');
});

module.exports = app;
