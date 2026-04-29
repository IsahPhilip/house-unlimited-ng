# WordPress Theme

`wordpress-theme/house-unlimited-headless` is the theme to install on the WordPress subdomain.

## What it handles

- Registers menus and thumbnails for WordPress editors.
- Adds a Reading setting for the public Next.js frontend URL.
- Redirects anonymous frontend traffic from WordPress to the Next.js site.
- Exposes the frontend URL through both REST and WPGraphQL.
- Generates preview links that point to the decoupled frontend.

## Install

1. Copy `house-unlimited-headless` into `wp-content/themes/`.
2. Activate it in WordPress.
3. Install and activate `WPGraphQL`.
4. Set the `Headless Frontend URL` under `Settings > Reading`.
5. Create a WordPress menu and assign it to the `Primary Menu` location.

## Important note on plugin compatibility

Plugin compatibility in a headless build is not automatic. A plugin must expose the data you need through:

- WPGraphQL fields, or
- the WordPress REST API

If a plugin only renders PHP shortcodes or blocks, the React/Next frontend has to rebuild that UI manually using the plugin's API response.
