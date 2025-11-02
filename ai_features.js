// ai_features.js
// Demo client-side AI features for chatbot, forum auto-tagging, and soil scanner.

function appendChat(role, text){
  const container = document.getElementById('chatMessages')
  if(!container) return
  const div = document.createElement('div'); div.className = 'msg '+(role==='user' ? 'user' : 'ai'); div.textContent = text
  container.appendChild(div); container.scrollTop = container.scrollHeight
}

// Simple mock of local weather and soil context
const MOCK_CONTEXT = {
  location: 'Demo Farm, Punjab',
  weather: {today: 'Sunny', next7: ['Sunny','Cloudy','Rain','Rain','Sunny','Sunny','Cloudy']},
  soil: {ph:6.5, moisture:38}
}

// Send a prompt to the (mock) AI and get a synthesized response.
async function sendToAI(prompt, lang='en'){
  // Try server proxy first (POST /api/ai). If it fails, fall back to local demo.
  try{
    const resp = await fetch('/api/ai', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({prompt, lang})
    })
    if(resp.ok){
      const j = await resp.json()
      if(j && j.reply) return j.reply
      // continue to fallback
    } else {
      // non-200 from server, attempt to read message for debugging but still fall back
      try{ const txt = await resp.text(); console.warn('AI proxy non-ok:', resp.status, txt) }catch(e){}
    }
  }catch(err){
    console.warn('AI proxy fetch failed, using local demo:', err)
  }

  // Fallback: local mock implementation (keeps previous heuristics)
  return new Promise(resolve=>{
    setTimeout(()=>{
      const p = prompt.toLowerCase()
      if(p.includes('urea') || (p.includes('how much') && p.includes('urea'))){
        resolve(lang==='hi' ? 'Demo उत्तर: 1 एकड़ गेहूं के लिए लगभग 40-50 किलो यूरिया (स्थानीय मिट्टी के अनुसार समायोजित करें)।' : 'Demo answer: For 1 acre wheat approximately 40-50 kg urea (adjust per soil test).')
      } else if(p.includes('when') && p.includes('water')){
        const tomorrow = MOCK_CONTEXT.weather.next7[0]
        const ans = lang==='hi' ? `Demo उत्तर: कल मौसम ${tomorrow} होने की संभावना है — यदि बरसात नहीं है, तो सुबह सिंचाई करें।` : `Demo answer: Tomorrow is expected ${tomorrow} — if no rain, water in the morning.`
        resolve(ans)
      } else {
        resolve(lang==='hi' ? 'Demo उत्तर: यह एक डेमो उत्तर है — वास्तविक AI को जोड़ें।' : 'Demo answer: This is a demo reply — plug your AI provider for richer answers.')
      }
    }, 700)
  })
}

// Chat UI wiring
if(document.getElementById('chatSend')){
  document.getElementById('chatSend').addEventListener('click', async ()=>{
    const input = document.getElementById('chatInput')
    const lang = document.getElementById('chatLang').value || 'en'
    const text = input.value.trim(); if(!text) return
    appendChat('user', text)
    input.value = ''
    appendChat('ai', lang==='hi' ? 'सोच रहे हैं...' : 'Thinking...')
    const res = await sendToAI(text, lang)
    // replace last AI placeholder
    const msgs = document.getElementById('chatMessages')
    const last = msgs.lastElementChild
    if(last) last.textContent = res
  })
}

// Forum auto-tagging & posts storage
if(document.getElementById('postSubmit')){
  document.getElementById('postSubmit').addEventListener('click', async ()=>{
    const title = document.getElementById('postTitle').value.trim()
    const details = document.getElementById('postDetails').value.trim()
    const imgInput = document.getElementById('postImage')
    if(!title||!details) return alert('Please fill title and details')
    // mock tagger
    let tag = 'general'
    const t = (title+details).toLowerCase()
    if(t.includes('leaf')||t.includes('blight')||t.includes('spot')) tag = 'Leaf issue'
    else if(t.includes('pest')) tag = 'Pest'
    else if(t.includes('soil')) tag = 'Soil issue'
    // read image if present
    let imgData = null
    if(imgInput && imgInput.files && imgInput.files[0]){
      const r = new FileReader()
      imgData = await new Promise(rsl=>{ r.onload = e=>rsl(e.target.result); r.readAsDataURL(imgInput.files[0]) })
    }
    const post = {id:'post_'+Date.now(), title, details, tag, img:imgData, replies:[]}
    const posts = JSON.parse(localStorage.getItem('forum_posts')||'[]')
    posts.unshift(post)
    localStorage.setItem('forum_posts', JSON.stringify(posts))
    renderPosts()
    document.getElementById('postForm').reset()
  })
}

function renderPosts(){
  const wrap = document.getElementById('postsList'); if(!wrap) return
  const posts = JSON.parse(localStorage.getItem('forum_posts')||'[]')
  wrap.innerHTML = ''
  posts.forEach(p=>{
    const d = document.createElement('div'); d.className='post'
    d.innerHTML = `<strong>${p.title}</strong><div class="tag">${p.tag}</div><p>${p.details}</p>`
    if(p.img) d.innerHTML += `<img src="${p.img}" alt="post image"/>`
    d.innerHTML += `<div style="margin-top:8px"><button class="btn" onclick='replyPost("${p.id}")'>Reply</button></div>`
    wrap.appendChild(d)
  })
}
renderPosts()

function replyPost(id){
  const reply = prompt('Write reply (demo)')
  if(!reply) return
  const posts = JSON.parse(localStorage.getItem('forum_posts')||'[]')
  const p = posts.find(x=>x.id===id); if(!p) return
  p.replies.push({text:reply,date:new Date().toISOString()}); localStorage.setItem('forum_posts', JSON.stringify(posts))
  renderPosts()
}

// Soil scanner demo: naive visual/color heuristics and sensor simulation
if(document.getElementById('soilPhoto')){
  document.getElementById('soilPhoto').addEventListener('change', e=>{
    const f = e.target.files[0]; if(!f) return
    const r = new FileReader(); r.onload = ev=>{
      const img = document.createElement('img'); img.src = ev.target.result; img.style.maxWidth='240px'
      const prev = document.getElementById('soilPreview'); prev.innerHTML=''; prev.appendChild(img)
      // very naive color analysis by sampling average color from the image (demo only)
      const canvas = document.createElement('canvas'); const c = canvas.getContext('2d')
      const tempImg = new Image(); tempImg.onload = ()=>{
        const w = Math.min(200, tempImg.width); const h = Math.min(200, tempImg.height)
        canvas.width=w; canvas.height=h; c.drawImage(tempImg,0,0,w,h)
        const data = c.getImageData(0,0,w,h).data
        let rsum=0, gsum=0, bsum=0, count=0
        for(let i=0;i<data.length;i+=40){ rsum+=data[i]; gsum+=data[i+1]; bsum+=data[i+2]; count++ }
        const ravg = Math.round(rsum/count), gavg=Math.round(gsum/count), bavg=Math.round(bsum/count)
        // heuristics: darker, more brownish => likely organic, pale => sandy
        const score = (ravg + gavg + bavg)/3
        let interpretation = 'Loamy/Normal'
        if(score<70) interpretation='Very dark (high organic)'
        else if(score>180) interpretation='Sandy/Light'
        document.getElementById('soilAnalysis').innerHTML = `<p>Color sample: rgb(${ravg},${gavg},${bavg}) — ${interpretation}</p>`
      }
      tempImg.src = ev.target.result
    }
    r.readAsDataURL(f)
  })
}

if(document.getElementById('simulateSensor')){
  document.getElementById('simulateSensor').addEventListener('click', ()=>{
    const mode = document.getElementById('sensorMode').value
    // produce mock sensor values
    if(mode==='moist') document.getElementById('sensorResult').textContent = 'Moisture: '+(30+Math.floor(Math.random()*50))+'%'
    else if(mode==='ph') document.getElementById('sensorResult').textContent = 'pH: '+(5 + Math.round(Math.random()*30)/10)
    else if(mode==='n') document.getElementById('sensorResult').textContent = 'Estimated N deficiency: '+(['Low','Medium','High'][Math.floor(Math.random()*3)])
  })
}

// export functions for potential integration
window.sendToAI = sendToAI
window.renderPosts = renderPosts
window.replyPost = replyPost

// --- Voice-to-AI Diagnosis (Upload page) ---
;(function(){
  const startBtn = document.getElementById('startVoice')
  const stopBtn = document.getElementById('stopVoice')
  const transcriptEl = document.getElementById('transcript')
  const replyEl = document.getElementById('voiceReply')
  const langEl = document.getElementById('voiceLang')
  if(!startBtn || !stopBtn || !transcriptEl) return

  // Cross-browser SpeechRecognition
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || null
  if(!SpeechRecognition){
    transcriptEl.innerHTML = '<em>Speech recognition not supported in this browser.</em>'
    startBtn.disabled = true
    stopBtn.disabled = true
    return
  }

  const recognizer = new SpeechRecognition()
  recognizer.continuous = false
  recognizer.interimResults = true

  let finalTranscript = ''

  recognizer.onresult = (ev)=>{
    let interim = ''
    for(let i=ev.resultIndex;i<ev.results.length;i++){
      const r = ev.results[i]
      if(r.isFinal) finalTranscript += r[0].transcript
      else interim += r[0].transcript
    }
    transcriptEl.textContent = finalTranscript + (interim? ' ('+interim+')':'')
  }

  recognizer.onerror = (e)=>{
    transcriptEl.textContent = 'Recognition error: '+(e.error||e.message||'unknown')
  }

  recognizer.onend = ()=>{
    startBtn.disabled = false
    stopBtn.disabled = true
    if(finalTranscript.trim()) sendDiagnosis(finalTranscript)
  }

  startBtn.addEventListener('click', ()=>{
    finalTranscript = ''
    transcriptEl.textContent = ''
    replyEl.style.display = 'none'
    const sel = (langEl && langEl.value) || 'en'
    // map to BCP-47 where possible for recognition
    const langMap = { en:'en-US', hi:'hi-IN', bn:'bn-IN', te:'te-IN', kn:'kn-IN', ta:'ta-IN' }
    recognizer.lang = langMap[sel] || sel
    startBtn.disabled = true
    stopBtn.disabled = false
    recognizer.start()
  })

  stopBtn.addEventListener('click', ()=>{
    recognizer.stop()
    stopBtn.disabled = true
  })

  async function sendDiagnosis(transcript){
    transcriptEl.textContent = transcript
    replyEl.style.display = 'block'
    replyEl.textContent = 'Analyzing (please wait)...'
    // Prepare a concise prompt for plant diagnosis
    const crop = (document.getElementById('cropType') && document.getElementById('cropType').value) || 'crop'
    const lang = (langEl && langEl.value) || 'en'
    const directive = `You are an agricultural expert. A farmer says: "${transcript}". The crop type is ${crop}. Provide a short probable diagnosis, likely cause, and practical remedy steps. Answer in the same language as requested (${lang}). Keep it concise and step-based.`
    try{
      const aiResp = await sendToAI(directive, lang)
      replyEl.innerHTML = aiResp
      // Save to history
      try{ saveDiagnosis({text:transcript, reply: aiResp, crop, lang, time: new Date().toISOString()}) }catch(e){console.warn('saveHistory failed',e)}
    }catch(err){
      replyEl.innerHTML = 'Error obtaining diagnosis: '+(err.message||err)
    }
  }
})();

// History utilities (localStorage)
function saveDiagnosis(record){
  const key = 'voice_diag_history'
  const list = JSON.parse(localStorage.getItem(key)||'[]')
  list.unshift(record)
  // keep last 25
  localStorage.setItem(key, JSON.stringify(list.slice(0,25)))
  renderDiagnosisHistory()
}

function renderDiagnosisHistory(){
  const key='voice_diag_history'
  const wrap = document.getElementById('historyList')
  if(!wrap) return
  const list = JSON.parse(localStorage.getItem(key)||'[]')
  if(!list.length){ wrap.innerHTML='(no history)'; return }
  wrap.innerHTML = ''
  list.forEach(r=>{
    const d = document.createElement('div'); d.style.padding='8px'; d.style.borderBottom='1px solid rgba(0,0,0,0.04)'
    const time = new Date(r.time).toLocaleString()
    d.innerHTML = `<div style="font-weight:700">${r.text}</div><div style="font-size:0.9rem;color:#666">${time} — ${r.crop} — ${r.lang}</div><div style="margin-top:6px">${r.reply}</div>`
    wrap.appendChild(d)
  })
}

// Hook up text-input fallback and clear history
;(function(){
  const sendBtn = document.getElementById('sendTextDiag')
  const clearBtn = document.getElementById('clearHistory')
  const textInput = document.getElementById('textDiag')
  if(sendBtn && textInput){
    sendBtn.addEventListener('click', async ()=>{
      const txt = textInput.value.trim(); if(!txt) return alert('Please type symptoms')
      // reuse the same flow as voice
      const crop = (document.getElementById('cropType') && document.getElementById('cropType').value) || 'crop'
      const lang = (document.getElementById('voiceLang') && document.getElementById('voiceLang').value) || 'en'
      const directive = `You are an agricultural expert. A farmer says: "${txt}". The crop type is ${crop}. Provide a short probable diagnosis, likely cause, and practical remedy steps. Answer in the same language as requested (${lang}). Keep it concise and step-based.`
      try{
        const aiResp = await sendToAI(directive, lang)
        // show near voiceReply if present
        const replyEl = document.getElementById('voiceReply')
        if(replyEl){ replyEl.style.display='block'; replyEl.innerHTML = aiResp }
        saveDiagnosis({text:txt, reply:aiResp, crop, lang, time:new Date().toISOString()})
      }catch(e){ alert('Diagnosis failed: '+(e.message||e)) }
    })
  }
  if(clearBtn){
    clearBtn.addEventListener('click', ()=>{ localStorage.removeItem('voice_diag_history'); renderDiagnosisHistory() })
  }
  // initial render
  renderDiagnosisHistory()
})()

