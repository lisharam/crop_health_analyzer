Crop Health Analyzer — README

Overview

This is a demo static site (vanilla HTML/CSS/JS) for a small farmer-focused Crop Health Analyzer. It includes:

- Image-based demo diagnosis (client-side simulated model) — upload images and get a mock diagnosis.
- Voice-to-AI diagnosis on the Upload page — uses the Web Speech API for transcription and sends a prompt to the AI proxy.
- Demo Chatbot (Fertilizer & Irrigation Advisor), Community Forum (auto-tagging + replies), Soil Health Scanner.
- A tiny Node/Express AI proxy (optional) that forwards prompts to OpenAI (or another LLM provider) server-side.

This README explains how to run the project locally, enable the AI proxy, test the endpoints, and important security notes.

Repository layout (top-level)

- index.html — Homepage
- upload.html — Upload + Voice-to-AI Diagnosis page
- chatbot.html — Demo Fertilizer & Irrigation Advisor page
- forum.html — Community Forum page
- soil.html — Soil Health Scanner page
- kb.html — Knowledge Base
- result.html, dashboard.html, login.html, signup.html, contact.html, admin.html — other pages
- script.js — Global client logic, translations, topbar, voice guide
- ai_features.js — Demo AI features + client wiring, voice transcription handling (calls /api/ai)
- server.js — Optional Node/Express proxy that forwards requests to OpenAI (if you run it)
- package.json — dependencies for the proxy (express, node-fetch, dotenv, express-rate-limit)
- .env.example — environment variable examples (OPENAI_API_KEY, PROXY_TOKEN, RATE_LIMIT settings)

Quick notes about how the system works

- Client-first demo: The site is primarily static. `ai_features.js` contains a `sendToAI(prompt, lang)` function that first tries to POST to `/api/ai` on the same host (the proxy). If that server isn't present or returns an error, it automatically falls back to a local demo heuristic response so the UI remains functional.
- Voice diagnosis: Upload page includes a voice UI. It uses the browser Web Speech API for speech->text, then sends a concise diagnostic prompt (with crop and language) to `sendToAI()` and shows the reply. Diagnoses are saved to localStorage and shown in a small history panel.
- AI Proxy: `server.js` is a small Express proxy that validates input, has optional token auth (`PROXY_TOKEN`), basic rate limiting, and forwards prompts to OpenAI Chat Completions. It also uses a tuned system prompt for India-focused agriculture advice.

Prerequisites (local dev)

- Node.js (v16+ recommended) to run the proxy server. The static site itself can be opened in a browser but fetching `/api/ai` requires serving the site (not file://).
- A modern browser (Chrome, Edge) for Web Speech API (voice features) and Web Speech Synthesis (voice guide). Mobile browsers may behave differently.

Setup & run (PowerShell on Windows)

1. Open PowerShell and change to the project directory:

```powershell
cd 'C:\Users\Lisha\Downloads\crop_health_analyzer (1)'
```

2. Install server dependencies (if you plan to run the AI proxy):

```powershell
npm install
```

3. Create a `.env` file from the example:

```powershell
copy .env.example .env
# then open .env in a text editor and paste your OPENAI_API_KEY
```

4. (Optional but recommended) set a proxy token to protect the API:

- Open `.env` and set `PROXY_TOKEN=your-secret-token`

When `PROXY_TOKEN` is set, the proxy will require an `X-Proxy-Token` or `X-API-Key` header with the same token. The client does not add this header automatically — this is deliberate for demo environments.

5. Start the server (runs Express and serves the static files):

```powershell
npm start
```

6. Open the site in your browser:

http://localhost:3000

Testing the AI endpoint (PowerShell)

If the server is running and you have an OPENAI_API_KEY in `.env`, you can test `/api/ai` using PowerShell's Invoke-RestMethod:

```powershell
$body = @{ prompt = "My tomato leaves are turning yellow and curling"; lang = "en" } | ConvertTo-Json
Invoke-RestMethod -Uri 'http://localhost:3000/api/ai' -Method Post -ContentType 'application/json' -Body $body
```

If you set `PROXY_TOKEN` in `.env`, include the header via -Headers:

```powershell
$headers = @{ 'X-Proxy-Token' = 'your-secret-token' }
Invoke-RestMethod -Uri 'http://localhost:3000/api/ai' -Method Post -ContentType 'application/json' -Headers $headers -Body $body
```

Expected response: JSON with a `reply` field containing the assistant's answer.

Client behavior & usage notes

- AI calls from client: `ai_features.js` calls `sendToAI(prompt, lang)` which will POST to `/api/ai` (same host) and use the returned `reply` text. If it can't reach the server, it returns a fallback demo answer.
- Voice diagnosis (Upload page): Click "Start Listening", speak symptoms (in the selected language), click Stop or let recognition end; diagnosis will display and be saved to history. If Web Speech API isn't available, the UI provides a text fallback field.
- Voice Guide: Header voice guide button speaks page-specific brief guidance. Double-click the voice guide to stop it immediately.

Security recommendations before public deployment

- DO NOT commit your OpenAI API key. Keep keys in server environment variables only.
- Require authentication or a proxy token when exposing the proxy publicly. Set `PROXY_TOKEN` and implement client auth to distribute short-lived session tokens rather than embedding the proxy token in JavaScript.
- Add stronger rate-limiting and request logging to detect/mitigate abuse.
- Sanitize and validate inputs server-side; the proxy includes simple checks (prompt required, max length) by default — increase rigor for production.
- Consider billing and usage limits per authenticated user to avoid surprise costs.

How to customize prompts & behavior

- The server-side system prompt in `server.js` is tailored to Indian smallholder agriculture and provides concise, safety-aware guidance. Edit `server.js` to tune the system prompt or change the model (`OPENAI_MODEL` env var).
- Client-side `ai_features.js` contains the logic that builds a short directive for diagnosis; you can modify wording or attach additional context (location, recent weather) before sending.

Troubleshooting

- `node` not found: install Node.js (https://nodejs.org) or use your package manager.
- Speech recognition not working: check browser compatibility; Chrome desktop is well supported. For mobile browsers, behavior varies.
- CORS / file:// issues: open the site via the server (http://localhost:3000) not via double-click (file://) when testing the proxy.
- Proxy returns 401/403: set `PROXY_TOKEN` or remove it from `.env` for local testing without token.

Development notes

- The project aims to be minimal and demo-safe: AI calls are proxied and the client preserves functionality when the server is absent.
- For production, move the AI logic to a secure backend with user authentication, usage accounting, and improved logging/monitoring.

Next steps you might want me to implement

- Add client-side header injection supporting `PROXY_TOKEN` for authorized clients (only safe with per-session tokens).
- Add an admin UI to view usage logs and manage allowed tokens.
- Add unit tests for server input validation.

If you want, I can expand this README with more screenshots, an example `.env` with comments, or step-by-step screenshots for the Upload voice flow.
