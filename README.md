<p align="center">
  <img src="public/logo.svg" width="120" alt="CheckoutCanvas logo" />
</p>

<h1 align="center">CheckoutCanvas</h1>
<p align="center"><em>Design your checkout, your way.</em></p>

CheckoutCanvas is an embedded Shopify admin app that lets merchants restyle their checkout in one click. It ships with a library of ready-made checkout styles (colors, fonts, corner radii, and button styling) plus a full customization page for building your own look — all applied through Shopify's [Checkout Branding API](https://shopify.dev/docs/apps/build/checkout/styling).

## Features

- **Style library** — 12 ready-made checkout themes (Minimal Noir, Ocean Breeze, Sunset Pop, Forest Luxe, Midnight Mode, Rose Quartz, Espresso, Royal Purple, Citrus Fresh, Slate Pro, Golden Hour, Bubblegum). Each preset sets checkout colors, typography, corner radius, and button styles. Apply any of them with one click.
- **Customize page** — pick your own background, text, accent, and button colors, corner radius, and font, with a live preview, and apply it to any checkout profile.
- **Checkout profile picker** — choose which checkout profile (draft or published) to apply styles to.

> **Note:** Shopify's Checkout Branding API is available on **Shopify Plus** stores (and development stores with checkout extensibility enabled). On other plans the app loads but applying styles returns an access error.

## Tech stack

Built on the official [Shopify Remix app template](https://github.com/Shopify/shopify-app-template-remix): Remix + Vite, Polaris, App Bridge, Prisma (SQLite session storage), and the Shopify Admin GraphQL API (`checkoutProfiles` query and `checkoutBrandingUpsert` mutation).

## Getting started

Prerequisites: Node 20.19+ (or 22.12+), a [Shopify Partner account](https://partners.shopify.com), and a development store with [checkout extensibility](https://help.shopify.com/en/manual/checkout-settings/checkout-extensibility).

```bash
npm install
npm run dev
```

`npm run dev` uses the Shopify CLI: it will prompt you to log in, create the app in your Partner dashboard (which fills in `client_id`), and install it on your dev store. Open the app from your store admin, pick a style, and hit **Apply style**.

## Project structure

- `app/presets/checkoutStyles.ts` — the ready-made style presets and their Checkout Branding inputs
- `app/models/checkoutBranding.server.ts` — GraphQL calls (`checkoutProfiles`, `checkoutBrandingUpsert`)
- `app/routes/app._index.tsx` — the style library gallery
- `app/routes/app.customize.tsx` — the build-your-own-style page with live preview
- `public/logo.svg`, `public/wordmark.svg` — app branding

## Required scopes

`read_checkout_branding_settings`, `write_checkout_branding_settings` (configured in `shopify.app.toml`).
