## Environment Variables (Cloudflare Pages → Settings → Environment Variables)
- `SQUARE_ENV` = `sandbox` (test) or `production` (live)
- `SQUARE_ACCESS_TOKEN` = your (rotated) token
- `SQUARE_APPLICATION_ID` = your publishable app id
- *(optional)* `SQUARE_LOCATION_ID` = lock to a specific location (else auto-detect)

### Health
- `/api/health` → `{ ok: true }` when configured
- `/api/locations` → list your locations (to choose a location id if desired)
