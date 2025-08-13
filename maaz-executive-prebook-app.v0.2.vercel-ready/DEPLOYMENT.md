# Vercel Deployment Guide

## Option A — Import from GitHub
1. Push this folder to a new GitHub repo.
2. In Vercel, click **Add New → Project → Import from GitHub**.
3. Select the repo and accept defaults (Framework: **Next.js**, Build Command: `next build`, Output: `.next`).
4. In **Settings → Environment Variables**, add:
   - `GOOGLE_MAPS_API_KEY`
   - `SUMUP_CLIENT_ID`
   - `SUMUP_CLIENT_SECRET`
   - `SUMUP_MERCHANT_CODE`
   - `SMTP_HOST`
   - `SMTP_PORT` (e.g., `587`)
   - `SMTP_USER`
   - `SMTP_PASS`
5. **Deploy**. Preview URL appears in a minute.

## Option B — Vercel CLI (direct upload)
```bash
npm i -g vercel
vercel login
vercel
# follow prompts, then:
vercel --prod
```

## After Deploy
- Test homepage, run an estimate, and submit a booking request.
- If distance stays blank, add `GOOGLE_MAPS_API_KEY` and redeploy.
- If SumUp link errors, double-check SumUp env vars and that Checkout API is enabled.

## Custom Domain
- In Vercel **Domains**, add e.g. `book.maazexecutive.co.uk`.
- Create a CNAME in your DNS pointing to the Vercel target shown.
