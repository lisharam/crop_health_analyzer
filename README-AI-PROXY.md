AI proxy (demo) for Crop Health Analyzer

What this adds
- A tiny Node/Express proxy at POST /api/ai that forwards prompts to OpenAI Chat Completions (gpt-3.5-turbo) using the server-side OPENAI_API_KEY.
- Client `ai_features.js` updated to call /api/ai first and fall back to the local demo if the server is not reachable.

Quick start (local)
1. Install Node (v16+ recommended).
2. In the project folder run:

   npm install

3. Create a .env file (copy .env.example) and set your OPENAI_API_KEY.

4. Start the server:

   npm start

5. Open http://localhost:3000 in your browser.

Security notes
- KEEP your OpenAI API key secure and never commit it to version control. Use server-side env vars.
- This proxy is intentionally minimal for demo purposes. For production, add authentication, rate-limiting, logging, and stricter input validation.

CORS and file://
- If you open files directly via file:// in your browser, fetch('/api/ai') will fail. Run the server (`npm start`) to serve pages via http://localhost:3000.

Extending
- Change the model, system prompt, temperature, or use streaming endpoints as needed.
- Add usage logging and per-IP rate limits to avoid abuse.
