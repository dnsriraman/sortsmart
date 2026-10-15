# SortSmart

SortSmart is a React and Express waste sorting assistant. The server uses SQLite for activity, credits, quiz completion, complaints, and campus reports, and can use Gemini for image analysis.

## Run locally

Requirements: Node.js 22.13 or newer.

1. Run `npm install`.
2. Copy `.env.example` to `.env.local` and set `GEMINI_API_KEY` to your own secret key. Never commit or share `.env.local`.
3. Run `npm run dev` and open the URL printed by the server (normally `http://localhost:3000`).

## Deploy to a Node.js host

1. Upload this project or its ZIP to a Node.js hosting service with Node.js 22.13+.
2. Set `NODE_ENV=production` and configure `GEMINI_API_KEY` in the host's secret/environment settings. The host supplies `PORT`.
3. Set `SORTSMART_DB_PATH` to a writable, persistent file path on the host (for example `/data/sortsmart.sqlite` if `/data` is a persistent volume). If the host has ephemeral storage, data can disappear on restarts. SQLite is intended for one app instance; use a managed database before scaling to multiple instances.
4. Build with `npm run build`; start with `npm start`. The start command serves the built app and API from the same port.

## Deploy to Netlify

This project includes a Netlify Function adapter and rewrites `/api/*` requests to the Express API. Connect the project repository to Netlify and use the included `netlify.toml` settings (`npm run build`, publish `dist`, functions in `netlify/functions`). Add `GEMINI_API_KEY` in **Site configuration → Environment variables**, then redeploy. A manual deploy of only the `dist` folder will omit the API function and cause API 404 errors.

Netlify Functions use a small in-memory data store in this demo because function bundles cannot safely use the app's local SQLite file. Records can reset between invocations and are not shared across function instances. Use a managed persistent database before relying on credits, complaints, or user history.

## Before public launch

This is a demo application, not a secured production service. The current sign-in and role selection are client-side demo flows, while API routes accept caller-supplied user IDs. Add server-side authentication and authorization, protect admin routes, and apply request limits before exposing it publicly. Review the bundled recycling-centre records for accuracy in your service area.

The database starts empty. User-generated records are saved to the configured SQLite file on a Node host with persistent disk. No API secrets or local database contents belong in the source ZIP.
