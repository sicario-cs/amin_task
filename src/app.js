import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

const SEED_QUOTES = [
  { text: 'Simplicity is the soul of efficiency.', author: 'Austin Freeman' },
  { text: 'Make it work, make it right, make it fast.', author: 'Kent Beck' },
  { text: 'Programs must be written for people to read.', author: 'Harold Abelson' },
];

export function createApp() {
  const app = express();

  // Each app instance owns its data, so tests never leak into each other.
  const quotes = SEED_QUOTES.map((quote, index) => ({ id: index + 1, ...quote }));
  let nextId = quotes.length + 1;

  app.use(express.json());
  app.use(express.static(PUBLIC_DIR));

  app.get('/health', (req, res) => {
    res.json({ status: 'ok', uptime: Math.round(process.uptime()) });
  });

  app.get('/api/quotes', (req, res) => {
    res.json(quotes);
  });

  app.get('/api/quotes/random', (req, res) => {
    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    res.json(quote);
  });

  app.post('/api/quotes', (req, res) => {
    const { text, author } = req.body ?? {};

    if (typeof text !== 'string' || text.trim() === '') {
      return res.status(400).json({ error: 'Field "text" is required.' });
    }

    const quote = {
      id: nextId++,
      text: text.trim(),
      author: typeof author === 'string' && author.trim() !== '' ? author.trim() : 'Anonymous',
    };

    quotes.push(quote);
    res.status(201).json(quote);
  });

  app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
  });

  return app;
}
