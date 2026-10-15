import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { app } from './server.ts';

const moduleDir = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || 3000);

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(moduleDir, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(moduleDir, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`SortSmart fullstack server listening on http://0.0.0.0:${port}`);
  });
}

startServer();
