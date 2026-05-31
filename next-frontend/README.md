# Next Frontend

This folder contains the new SSR-ready frontend for the headless WordPress setup.

## What it does

- Uses Next.js App Router for server-rendered routes.
- Pulls WordPress content through WPGraphQL.
- Provides starter routes for `/`, `/blog`, `/blog/[slug]`, and `/properties`.
- Leaves the existing Vite frontend intact so migration can happen page by page.

## Required WordPress plugins

- `WPGraphQL`
- `WPGraphQL for ACF` if your custom fields live in ACF
- Your property plugin or custom post type must be exposed to GraphQL

## Local setup

1. Copy `.env.example` to `.env.local`.
2. Point `NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT` to your WordPress `/graphql` endpoint.
3. Set `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-LHRMPQ3Y12` so Google Analytics loads on the live site.
4. Install dependencies in this folder.
5. Run `npm run dev:next` from the repo root.

## Mapping notes

- Blog content is already modeled around WordPress posts and should migrate first.
- Property data still assumes a `properties` GraphQL type with `propertyFields`.
- If your real schema differs, only `src/lib/graphql/queries.ts` and the property mapper in `src/lib/wordpress.ts` should need changes.
- Newsletter subscriptions POST through `app/api/newsletter/route.ts`, which proxies to the WordPress backend route at `/wp-json/hun/v1/newsletter/subscribe`.
- WordPress stores subscribers as a dedicated private post type and sends the latest published newsletter issue to each new subscriber when available.
