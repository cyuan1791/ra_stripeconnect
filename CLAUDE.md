# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

A Stripe Connect sample integration — a platform that onboards connected accounts, lets them create products, and processes payments via Stripe Checkout with destination charges. The frontend is React (Vite), the backend is a single PHP file (`server.php`).

## Commands

- **Install dependencies:** `npm install` and `composer install`
- **Run dev server:** `npm run dev` — starts Vite on port 3000 and PHP built-in server on port 4242 concurrently
- **Build for production:** `npm run build`
- **Access locally:** http://localhost:3000

## Architecture

### Frontend (React + Vite)

- **Entry:** `index.html` → `src/index.jsx` → `src/App.jsx`
- **Routing:** React Router v6 with three routes: `/` (Home dashboard), `/done` (post-checkout), `/storefront/:accountId`
- **State:** `AccountProvider` (React Context) manages `accountId`, persisted to `localStorage`. No Redux or other state libraries.
- **`useAccountStatus` hook:** Polls `/api/account-status/:id` every 5 seconds. Returns `accountStatus`, `needsOnboarding`, and `refreshStatus`.
- **Products polling:** `Products` component also polls `/api/products/:accountId` every 5 seconds.
- **Checkout flow:** `Products` component submits a native HTML form POST to `/api/create-checkout-session`, which redirects (303) to Stripe's hosted checkout page.

### Backend (`server.php`)

Single-file PHP router using `$_SERVER['REQUEST_URI']` pattern matching. All routes are under `/api/`:

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/create-connect-account` | POST | Creates a Stripe Connect account (express dashboard type) |
| `/api/create-account-link` | POST | Generates an onboarding link for a connected account |
| `/api/account-status/:id` | GET | Retrieves account status (charges/payouts enabled, details submitted) |
| `/api/create-product` | POST | Creates a product + price on the platform, tagged with account metadata |
| `/api/products/:id` | GET | Searches prices by account metadata, returns product list |
| `/api/create-checkout-session` | POST | Creates Checkout Session with destination charges (application fee: 123 cents) |
| `/api/webhook` | POST | Handles classic webhook events |
| `/api/thin-webhook` | POST | Handles v2 thin webhook event notifications |

### Key Details

- Vite proxies `/api` requests to `http://localhost:4242` (the PHP server) during dev.
- Products are stored on the **platform** account with `metadata.stripeAccount` linking them to the connected account; they are retrieved via Stripe's price search API.
- The checkout session uses **destination charges** — the platform collects payment and transfers to the connected account minus a 123-cent application fee.
- Environment variables: `STRIPE_SECRET_KEY` (server-side), `VITE_STRIPE_PUBLISHABLE_KEY` (client-side), `DOMAIN` (redirect base URL). Configured in `.env`.

## API Version Notes

All endpoints use the Stripe **v1 API**. The `/api/thin-webhook` endpoint handles v2 thin event notifications but all account/payment operations use v1.
