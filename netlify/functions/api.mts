import serverless from 'serverless-http';
import { app } from '../../server.ts';

// Netlify maps /api/* requests to this Express serverless function.
export const handler = serverless(app);
