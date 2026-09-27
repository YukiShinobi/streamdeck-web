# Streamdeck Web

A lightweight browser-based control deck built for the exact setup I wanted before: use a phone/tablet as a stream-control surface without needing dedicated hardware.

The current version exposes configurable buttons in a responsive web UI and broadcasts button presses over Server-Sent Events so a local desktop agent can react to them.

## Current features

- phone/tablet friendly control surface
- configurable button registry
- scene / clip / mute / marker-style actions
- POST action API
- live `/events` SSE stream for a desktop agent
- health endpoint with connected-agent count
- dark/crimson UI matching my current GitHub style
- no runtime dependencies

```bash
npm start
```

Open `http://localhost:9090` on the machine, or expose it safely on your LAN to use another device.

## Architecture

```text
phone / tablet
     ↓ HTTP
Web Deck server
     ↓ SSE
local desktop agent
     ↓
OBS / streaming tools / custom actions
```

The web server deliberately does **not** execute arbitrary shell commands. The next layer should be a separate local agent with a strict allow-list of actions.
