# Braintree Payment Demo

> **Disclaimer:** This project only shows how to add the Braintree commercetools checkout connector enabler to the shop frontend. It is not a production-ready shop implementation. For setting up a proper commercetools shop please refer to the [official commercetools documentation](https://docs.commercetools.com).

A minimalistic demo environment for Braintree payment methods integrated with commercetools. Built with React, Vite, TypeScript, and Storybook.

Storybook is the primary demo surface. The React app handles only the parts not directly related to the payment process (cart creation and configuration).

## Getting started

Install dependencies:

```bash
npm install
```

Create a `.env` file in the project root:

```env
VITE_CTP_PROJECT_KEY=
VITE_CTP_CLIENT_ID=
VITE_CTP_CLIENT_SECRET=
VITE_CTP_AUTH_URL=
VITE_CTP_API_URL=
VITE_CTP_SESSION_URL=
CTP_SCOPE=
VITE_PROCESSOR_URL=
BRAINTREE_MERCHANT_ACCOUNT_ID=
```

## Commands

```bash
npm run storybook        # start Storybook on :6006 (primary demo entry point)
npm run dev              # start Vite dev server
npm run build            # production build
npm run lint             # ESLint
npx vitest               # run story-based tests (headless Chromium via Playwright)
```

## Architecture

Cart configuration (product selection, shipping, discounts, customer) lives in React components under `src/components/`. These components communicate with commercetools via helpers in `src/helpers/`, split by entity:

| File | Responsibility |
| --- | --- |
| `helpers/auth.ts` | commercetools OAuth token |
| `helpers/session.ts` | CT session creation, JWT and payment method fetching |
| `helpers/cart.ts` | cart CRUD |
| `helpers/shipping.ts` | shipping methods and shipping address |
| `helpers/customer.ts` | customer assignment and billing address |
| `helpers/products.ts` | product fetch, add/remove line items |
| `helpers/discount.ts` | discount code add/remove |
| `helpers/format.ts` | price formatting |

The CT SDK client is set up in `src/clent/ctAPI.ts` and used by all helpers. Auth and session helpers use plain `fetch` since they talk to the CT sessions API and the Braintree processor directly.

`CheckoutWrapper` orchestrates the full pre-payment flow and calls `onCheckoutReady` with everything needed to instantiate the Braintree `Enabler`.
