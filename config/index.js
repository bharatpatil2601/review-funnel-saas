// ============================================
// Review Funnel SaaS — Configuration
// ============================================

require('dotenv').config();

const config = {
  port: parseInt(process.env.PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',

  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
    model: 'gemini-2.0-flash',
    maxTokens: 256,
  },

  cors: {
    origins: process.env.CORS_ORIGINS
      ? process.env.CORS_ORIGINS.split(',').map((o) => o.trim())
      : '*',
  },

  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT, 10) || 465,
    secure: process.env.SMTP_SECURE === 'true' || true,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    receiver: 'digitaleurekamedia@gmail.com',
  },
};

// Validate critical env vars at boot
if (!config.gemini.apiKey) {
  console.error('[FATAL] GEMINI_API_KEY is missing. Set it in .env');
  process.exit(1);
}

module.exports = config;
