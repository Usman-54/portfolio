# Base44 Setup Notes

## Project Type
Static portfolio website (HTML/CSS/JS). No build step, no backend, no database.

## How It Runs
Served by `nginx:alpine` via `docker-compose.base44.yml` on host port 3000.
Source is bind-mounted read-only at `/usr/share/nginx/html`; edits to files
are immediately reflected on next request (no rebuild needed).

## Verification
- `docker compose -f docker-compose.base44.yml up -d --build`
- `curl http://localhost:3000/` should return the portfolio HTML.
- Call `reload_preview` after edits — there is no live-reload dev server for static files.

## Secrets
None required.
