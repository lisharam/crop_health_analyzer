const express = require('express')
const fetch = require('node-fetch')
const path = require('path')
const rateLimit = require('express-rate-limit')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3000
const OPENAI_KEY = process.env.OPENAI_API_KEY
const PROXY_TOKEN = process.env.PROXY_TOKEN || ''

// Basic rate limiter for the /api/ai endpoint
const aiLimiter = rateLimit({ windowMs: (process.env.RATE_LIMIT_WINDOW_MIN||60) * 60 * 1000, // default 60 minutes
  max: process.env.RATE_LIMIT_MAX || 200, // default 200 requests per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try later.' }
})

app.use(express.json({limit:'100kb'}))
// Serve static site
app.use(express.static(path.join(__dirname)))

// Middleware: optional token auth if PROXY_TOKEN is set
function requireToken(req, res, next){
  if(!PROXY_TOKEN) return next()
  const header = (req.headers['x-proxy-token'] || req.headers['x-api-key'] || '').toString()
  if(!header) return res.status(401).json({error:'Missing proxy token'})
  if(header !== PROXY_TOKEN) return res.status(403).json({error:'Invalid proxy token'})
  next()
}

app.post('/api/ai', aiLimiter, requireToken, async (req, res)=>{
  if(!OPENAI_KEY) return res.status(500).json({error:'Server misconfigured: OPENAI_API_KEY not set'})
  let {prompt, lang='en'} = req.body || {}
  if(!prompt || typeof prompt !== 'string') return res.status(400).json({error:'prompt is required and must be a string'})
  if(prompt.length > 2000) return res.status(400).json({error:'prompt too long'})
  lang = String(lang||'en')
  // Improved system prompt tailored for Indian crops and safe, concise guidance
  const systemPrompt = `You are an expert agricultural advisor focused on smallholder farmers in India. When given a farmer's symptom description and crop type, do the following: 1) Provide one or two most probable diagnoses (disease/pest/nutrient issue), 2) Give likely causes or contributing factors (soil, water, pests, weather, fertilizer), 3) Provide concise, practical, low-cost remedy steps (organic & chemical options where applicable), 4) Suggest one safe prevention step farmers can do, 5) Keep responses short (3-6 bullet points) and use the same language requested. Avoid medical, legal, or toxicological instructions; when a pesticide is listed, include safety precautions and recommended protective gear. Mention if a soil test or expert lab is recommended.`

  try{
    const payload = {
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: [
        {role:'system', content: systemPrompt},
        {role:'user', content: prompt}
      ],
      max_tokens: 400,
      temperature: 0.6
    }
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_KEY}`
      },
      body: JSON.stringify(payload)
    })
    if(!r.ok){
      const txt = await r.text()
      return res.status(502).json({error:'Upstream AI error', detail:txt})
    }
    const j = await r.json()
    const aiText = (j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content) || ''
    res.json({reply: aiText})
  }catch(err){
    console.error('AI proxy error',err)
    res.status(500).json({error:'Internal server error'})
  }
})

app.listen(PORT, ()=>console.log(`AI proxy server running on http://localhost:${PORT}`))
