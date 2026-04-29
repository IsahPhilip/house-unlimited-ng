# Headless Migration Guide

This repo now includes a starter path for converting the current React app into a WordPress-backed, SSR-ready frontend.

## What was added

- `next-frontend/`
  - New Next.js app router frontend
  - WPGraphQL fetch helpers
  - SSR routes for home, blog archive, blog detail, and properties
- `wordpress-theme/house-unlimited-headless/`
  - Minimal headless WordPress theme
  - Menu support
  - Preview link rewriting
  - Redirects from WordPress frontend to Next.js
  - REST and GraphQL exposure of the frontend URL

## Architecture

1. WordPress remains the content and user-management backend on the subdomain.
2. Next.js becomes the public website deployed on Vercel.
3. WPGraphQL is the preferred bridge for posts, menus, media, and plugin data.
4. WordPress theme stays intentionally thin because the public rendering moves to Next.js.

## How this maps to your current app

- Existing Vite SPA: kept in `frontend/` as a reference during migration.
- Blog: best first migration target because WordPress posts map naturally to `posts` in WPGraphQL.
- Properties: requires your WordPress schema to expose a `properties` type or equivalent.
- Auth, wishlist, and profile flows:
  - likely remain against your existing backend API, or
  - move into WordPress auth only if you intentionally want that rewrite.

## Recommended migration order

1. Install `WPGraphQL` on WordPress.
2. Activate the `House Unlimited Headless` theme.
3. Configure the Next frontend environment variables.
4. Migrate blog pages first.
5. Expose the property content type to GraphQL and wire its real fields.
6. Rebuild plugin-driven UI in Next.js one feature at a time.
7. Move high-value marketing pages from the old SPA into App Router routes.

## Important caveat

The new property query is a starter assumption:

- GraphQL type: `properties`
- field group: `propertyFields`
- fields: `price`, `propertyType`, `location`

If your WordPress property plugin uses different names, update:

- `next-frontend/src/lib/graphql/queries.ts`
- `next-frontend/src/lib/wordpress.ts`

## SEO outcome

The current Vite frontend is client-rendered and relies on browser execution before content appears.
The new Next.js frontend renders HTML on the server first, which gives search engines and social crawlers immediate content and metadata.
