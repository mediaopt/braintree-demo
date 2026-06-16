# Braintree Payment Demo

> **Note:** This is a demo for the Braintree commercetools connector. It demonstrates features relevant for different merchants and emphasizes payment-relevant aspects rather than buyer experience. It is not an official shop implementation — it is your responsibility to implement all surrounding pages in your shop. For implementation guidance refer to the [official commercetools documentation](https://docs.commercetools.com) and the [Checkout Browser SDK documentation](https://docs.commercetools.com/checkout/browser-sdk).

A minimalistic demo environment for Braintree payment methods integrated with commercetools. Built with React, Vite, TypeScript, and Storybook.

Storybook is the primary demo surface. The React app handles only the parts not directly related to the payment process (cart creation and configuration).

## Getting started

Install dependencies:

```bash
npm install
```

Copy `env.template` to `.env` in the project root and fill in your values:

```bash
cp env.template .env
```

## Commands

```bash
npm run storybook        # start Storybook on :6006 (primary demo entry point)
npm run serve-return     # start the return page template server on :6007
npm run dev              # start Vite dev server
npm run build            # production build
npm run lint             # ESLint
npx vitest               # run story-based tests (headless Chromium via Playwright)
```

`serve-return.mjs` is a minimal Node.js HTTP server that acts as the return page after checkout. Commercetools checkout redirects the customer to a return URL on payment completion; this server renders that URL and provides a link back to Storybook. Run it alongside Storybook when testing flows that redirect (e.g. 3DS, PayPal). In a real shop this page would be a proper order confirmation or result page.

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
