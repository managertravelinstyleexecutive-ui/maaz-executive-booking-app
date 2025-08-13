# Maaz Executive — Passenger Pre-Booking App (MVP)

- **Per-mile pricing** with **minimum fare** by class
- **Airport surcharges**: Pickup +£12; Drop-off Heathrow +£6 / Gatwick +£6 / Stansted +£7 / others £0
- **Waiting policy**: Airport pickups 60m free; Town pickups 30m allowed (first 15m free)
- **Google Maps** distance auto-calculation (optional env)
- Payment: **Pay during the ride** + optional **SumUp deposit link**

## Quick start
```bash
npm i
npm run dev
# open http://localhost:3000
```

## Environment
Create `.env.local` (optional keys):
```ini
# Email (optional)
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=

# Google Maps (for distance auto-calc)
GOOGLE_MAPS_API_KEY=

# SumUp (optional for deposits)
SUMUP_CLIENT_ID=
SUMUP_CLIENT_SECRET=
SUMUP_MERCHANT_CODE=
```

## Pricing config
See `lib/tariff.ts`:
- Business: perMile £2.80, minFare £62
- SUV/VAN:  perMile £3.80, minFare £84
- First:    perMile £3.80, minFare £84
- Airport pickup fee: +£12 (applied when *Airport pickup* toggle is on and flight provided)
- Drop-off surcharges: Heathrow +£6, Gatwick +£6, Stansted +£7, others £0 (detected by keywords)

## Distance calculation
Client calls `/api/distance?origin=...&destination=...`. If `GOOGLE_MAPS_API_KEY` is not set, miles can be typed manually.

## SumUp
If configured, `/api/checkout` creates a hosted checkout link and redirects the passenger. Otherwise, guests can **Pay during the ride**.
