import http from 'node:http';
import { randomUUID } from 'node:crypto';

const PORT = Number(process.env.PORT ?? 9090);
const listeners = new Set();

const buttons = [
  { id: 'scene-game', label: 'GAME', action: 'scene', payload: { scene: 'game' } },
  { id: 'scene-chat', label: 'CHAT', action: 'scene', payload: { scene: 'chatting' } },
  { id: 'clip', label: 'CLIP', action: 'clip', payload: {} },
  { id: 'mute', label: 'MUTE', action: 'audio.toggle', payload: { channel: 'mic' } },
  { id: 'brb', label: 'BRB', action: 'scene', payload: { scene: 'brb' } },
  { id: 'marker', label: 'MARK', action: 'marker', payload: {} }
];

function emit(event) {
  const packet = `data: ${JSON.stringify(event)}\n\n`;
  for (const res of listeners) res.write(packet);
}

function json(res, status, value) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(value));
}

function html() {
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no"><title>Yuki Deck</title><style>:root{font-family:Inter,system-ui;background:#050505;color:#f5f5f5}body{margin:0;min-height:100vh;background:radial-gradient(circle at top,#2a1015,transparent 40%),#050505}.wrap{max-width:780px;margin:auto;padding:30px 18px}.top{display:flex;justify-content:space-between;align-items:end;margin-bottom:25px}h1{font-size:2.3rem;margin:0}.muted{color:#8b8b91}.deck{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.key{aspect-ratio:1;border:1px solid #29292d;background:linear-gradient(145deg,#18191c,#0f1012);border-radius:20px;color:#fff;font-weight:800;font-size:1rem;box-shadow:inset 0 1px #ffffff0c,0 12px 35px #0008;touch-action:manipulation}.key:active{transform:scale(.96);background:#381319;border-color:#7a1f1f}.status{margin-top:18px;padding:12px 14px;border:1px solid #26262a;border-radius:12px;background:#101114;font-family:ui-monospace,monospace}@media(max-width:520px){.deck{grid-template-columns:repeat(2,1fr)}}</style></head><body><main class="wrap"><div class="top"><div><div class="muted">YukiShinobi</div><h1>Web Deck</h1></div><div class="muted">LOCAL CONTROL SURFACE</div></div><div id="deck" class="deck"></div><div id="status" class="status">waiting for input</div></main><script>async function load(){const buttons=await fetch('/api/buttons').then(r=>r.json());deck.innerHTML=buttons.map(b=>`<button class="key" data-id="${b.id}">${b.label}</button>`).join('');document.querySelectorAll('.key').forEach(btn=>btn.onclick=async()=>{const r=await fetch('/api/press/'+btn.dataset.id,{method:'POST'}).then(r=>r.json());status.textContent='sent '+r.event.action+' · '+new Date().toLocaleTimeString()})}load();</script></body></html>`;
}

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/api/buttons') return json(res, 200, buttons);

  if (req.method === 'GET' && req.url === '/events') {
    res.writeHead(200, { 'content-type': 'text/event-stream', 'cache-control': 'no-cache', connection: 'keep-alive' });
    res.write(': connected\n\n');
    listeners.add(res);
    req.on('close', () => listeners.delete(res));
    return;
  }

  if (req.method === 'POST' && req.url?.startsWith('/api/press/')) {
    const id = req.url.split('/').at(-1);
    const button = buttons.find(item => item.id === id);
    if (!button) return json(res, 404, { error: 'Unknown button' });
    const event = { id: randomUUID(), at: new Date().toISOString(), action: button.action, payload: button.payload };
    emit(event);
    return json(res, 202, { accepted: true, event });
  }

  if (req.method === 'GET' && req.url === '/health') return json(res, 200, { ok: true, connectedAgents: listeners.size });

  res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
  res.end(html());
});

server.listen(PORT, () => console.log(`Web Deck: http://localhost:${PORT}`));
