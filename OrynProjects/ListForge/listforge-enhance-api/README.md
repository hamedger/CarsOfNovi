# listforge-enhance-api

Minimal Render-ready Node/TypeScript API service for ListForge image enhancement.

## Endpoints

- `GET /health` - health check for Render deploy validation.
- `GET /v1/billing/config` - app billing and credit pack configuration.
- `POST /v1/photo/enhance` - photo enhancement.
- `POST /v1/photo/enhance/batch` - batch photo enhancement.
- `POST /v1/photo/upscale` - upscaling.
- `POST /v1/photo/enhance-upscale` - enhance + upscale in one request.

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
- `MODE_MULTIPLIER_AUTO` (default `1.5`)
- `MODE_MULTIPLIER_ELECTRONICS` (default `1.0`)
- `MODE_MULTIPLIER_GENERAL` (default `0.8`)
- `BILLING_TOPUP_PACKS_JSON` (optional JSON array of packs)
- `DEFAULT_AUTO_REFILL_THRESHOLD` (default `20`)
- `DEFAULT_AUTO_REFILL_PACK_ID` (default `growth`)

### Render env example

Use this for a one-time credit model with optional auto-refill:

```bash
ENHANCE_PROVIDER=remove_bg
REMOVE_BG_API_KEY=your_key
REMOVE_BG_API_BASE_URL=https://api.remove.bg/v1.0
SIGNED_URL_SECRET=replace_me
MAX_IMAGE_MB=12
REQUEST_TIMEOUT_MS=12000

MODE_MULTIPLIER_AUTO=1.5
MODE_MULTIPLIER_ELECTRONICS=1.0
MODE_MULTIPLIER_GENERAL=0.8
DEFAULT_AUTO_REFILL_THRESHOLD=20
DEFAULT_AUTO_REFILL_PACK_ID=growth
BILLING_TOPUP_PACKS_JSON=[{"id":"starter","label":"Starter Pack","credits":120,"priceUsd":9},{"id":"growth","label":"Growth Pack","credits":400,"priceUsd":25,"popular":true},{"id":"pro","label":"Pro Pack","credits":1200,"priceUsd":59}]
```
