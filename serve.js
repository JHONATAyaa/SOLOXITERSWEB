const express = require('express');
const path    = require('path');
const helmet  = require('helmet');
const rateLimit = require('express-rate-limit');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── SEGURANÇA ────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));
app.set('x-powered-by', false);
app.disable('x-powered-by');

// Headers anti-scan
app.use((_req, res, next) => {
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  next();
});

// Rate limit global
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Muitas requisições' },
}));

// ── ROTAS ────────────────────────────────────────────────
// Bloqueia acesso direto ao HTML pelo nome
app.get('/soloxiters.html', (_req, res) => res.status(404).send('Not Found'));

// Serve a página principal
app.get('/', (_req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.sendFile(path.join(__dirname, 'public', 'soloxiters.html'));
});

// Bloqueia todo o resto
app.use((_req, res) => res.status(404).send('Not Found'));

// ── START ────────────────────────────────────────────────
app.listen(PORT, () => console.log('[SOLOXITERS] Porta ' + PORT));
