# Vercel Cron Job: API Health Ping

This project includes a scheduled job that pings the backend API once per day to warm caches and verify health.

- Endpoint called: `${API_BASE}/data/app-initial-metadata`
- Scheduled route: `/api/cron/health`
- Schedule: Daily at 00:00 UTC (`0 0 * * *`), configured in `vercel.json`

## Setup

1. Set the `API_BASE` environment variable in your Vercel Project (Settings → Environment Variables):
   - Production: e.g. `https://petsetu-api.onrender.com/v1`
   - Preview/Development: as needed
2. Redeploy after changing env vars to ensure the cron job uses the latest value.

Note: `API_BASE` can include or omit a trailing slash. The code normalizes either format.

## Local testing

- Ensure your API is reachable at `API_BASE` defined in `.env.local`.
- Hit `http://localhost:3000/api/cron/health` while running the dev server. You should receive a JSON result with status and a short body preview.

## Observability

- On Vercel, check the Function Logs for `/api/cron/health` to see execution results.

## Security

This route is public by default. If you need to lock it down, add a shared secret check (e.g., `X-Cron-Secret`) and configure it in Vercel env vars.
