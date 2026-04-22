# listforge-enhance-api

Minimal Render-ready Node/TypeScript API service for ListForge image enhancement.

## Endpoints

- `GET /health` - health check for Render deploy validation.
- `POST /v1/photo/enhance` - scaffold endpoint (returns `501` until pipeline is implemented).

## Local run

```bash
npm install
npm run build
npm start
```

## Required environment variables

- `ENHANCE_PROVIDER`
- `REMOVE_BG_API_KEY`
- `REMOVE_BG_API_BASE_URL`
- `SIGNED_URL_SECRET`
- `MAX_IMAGE_MB`
- `REQUEST_TIMEOUT_MS`
