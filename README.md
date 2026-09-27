<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&height=200&text=WEB%20DECK&fontAlignY=38&desc=PHONE%20CONTROL%20%E2%80%A2%20SSE%20%E2%80%A2%20STREAMING&descAlignY=58&color=0:050505,55:202020,100:5a1616&fontColor=f5f5f5&descColor=d4d4d4" width="100%" />

![Web](https://img.shields.io/badge/interface-phone%20%2F%20tablet-111111?style=for-the-badge)
![Node](https://img.shields.io/badge/Node.js-20%2B-2b2b2b?style=for-the-badge&logo=nodedotjs)
![Events](https://img.shields.io/badge/events-SSE-7a1f1f?style=for-the-badge)

**A browser-based stream control surface built because I wanted to use a phone or tablet instead of buying dedicated hardware.**

</div>

---

## Current build

- responsive phone/tablet control surface
- configurable button registry
- scene / clip / mute / marker-style actions
- POST action API
- live `/events` Server-Sent Events stream
- health endpoint with connected-agent count
- black / silver / crimson UI
- no runtime dependencies

## Architecture

```txt
phone / tablet
     ↓ HTTP
Web Deck server
     ↓ SSE
local desktop agent
     ↓
OBS / streaming tools / allowed actions
```

## Run

```bash
npm start
```

Open `http://localhost:9090` locally, or expose it safely on your LAN for another device.

## Design boundary

The web server deliberately does **not** execute arbitrary shell commands. The next layer should be a separate local agent with a strict allow-list of actions. That keeps the control surface useful without turning it into a remote command endpoint.

## Next

`OBS adapter` · `Spotify controls` · `profiles` · `custom layouts` · `button feedback` · `LAN pairing`

---

<div align="center"><sub>YukiShinobi // use the hardware already on the desk.</sub></div>
