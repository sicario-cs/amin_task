import { createApp } from './app.js';

const port = Number(process.env.PORT) || 3000;

const server = createApp().listen(port, () => {
  console.log(`quotes-api listening on port ${port}`);
});

// Containers stop with SIGTERM; close cleanly so in-flight requests finish.
for (const signal of ['SIGTERM', 'SIGINT']) {
  process.on(signal, () => {
    console.log(`${signal} received, shutting down`);
    server.close(() => process.exit(0));
  });
}
