# WordPress Pages Integration Guide

## Overview

This guide explains how to add and manage static pages (About, Privacy, Terms, etc.) through WordPress and have them automatically rendered on your Next.js frontend.

## What Was Implemented

✅ **GraphQL queries** for WordPress pages (`PAGE_BY_SLUG_QUERY`, `PAGE_SLUGS_QUERY`)  
✅ **Helper functions** in `wordpress.ts` (`getPageBySlug`, `getPageSlugs`)  
✅ **Dynamic page component** at `/pages/[slug]`  
✅ **Type definitions** for page content  
✅ **Build integration** with static generation  

## How It Works

### Architecture

1. **WordPress** serves as the content management system
2. **WPGraphQL** exposes pages via GraphQL API
3. **Next.js** fetches page content and renders it server-side
4. **Dynamic routing** (`/pages/[slug]`) handles all WordPress pages

### Data Flow

```
WordPress Admin → WPGraphQL → Next.js (fetch) → Dynamic Page Component → Browser
```

## Setup Instructions

### 1. WordPress Configuration

#### Install Required Plugins
- **WPGraphQL** (required) - Exposes WordPress data via GraphQL
- **Advanced Custom Fields** (optional) - For structured content

#### Create Pages in WordPress

1. Log into WordPress admin
2. Go to **Pages → Add New**
3. Create the following pages (or any custom pages you need):
   - **About** (slug: `about`)
   - **Privacy Policy** (slug: `privacy`)
   - **Terms of Service** (slug: `terms`)
   - **Contact** (slug: `contact`) - Note: Contact page currently uses a custom form
   - Any other static pages you want

4. Add your content using the WordPress editor (Gutenberg)
5. **Publish** each page

### 2. Frontend Configuration

#### Environment Variables

Make sure your `.env.local` has the correct WordPress URL:

```env
NEXT_PUBLIC_WORDPRESS_URL=http://your-wordpress-site.com
NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT=http://your-wordpress-site.com/graphql
```

#### Verify GraphQL Access

Test that WPGraphQL is working by visiting:
```
http://your-wordpress-site.com/graphql
```

You should see the GraphQL Playground.

### 3. Accessing Pages

Once pages are created in WordPress, they'll be available at:

```
https://your-nextjs-site.com/pages/about
https://your-nextjs-site.com/pages/privacy
https://your-nextjs-site.com/pages/terms
```

## Customization Options

### Styling

The dynamic page component uses Tailwind CSS with these classes:
- `prose prose-lg prose-teal` - Typography styles from `@tailwindcss/typography`
- `max-w-4xl mx-auto px-4` - Layout constraints
- `animate-in fade-in duration-500` - Entry animation

To customize styling, edit `next-frontend/app/pages/[slug]/page.tsx`.

### Adding Custom Fields

If you want structured content (like custom layouts), you can:

1. **Install ACF Pro** on WordPress
2. **Install WPGraphQL for ACF** plugin
3. **Create field groups** for pages
4. **Update the GraphQL query** to include ACF fields:

```graphql
export const PAGE_BY_SLUG_QUERY = `
  query PageBySlug($slug: String!) {
    page(id: $slug, idType: URI) {
      slug
      title
      content
      date
      modified
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      acf {  # Add this section
        heroTitle
        heroDescription
        customLayout
      }
    }
  }
`;
```

5. **Update the PageContent type** in `wordpress.ts`:

```typescript
export type PageContent = {
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  date: string;
  modified: string;
  featuredImage?: {
    sourceUrl: string;
    altText?: string;
  };
  acf?: {
    heroTitle?: string;
    heroDescription?: string;
    customLayout?: any;
  };
};
```

### Menu Integration

Pages automatically appear in WordPress menus. To add a page to your navigation:

1. Go to **Appearance → Menus** in WordPress
2. Add your page to the **Primary Menu**
3. The menu will be automatically fetched and displayed in the Next.js header

## Migration from Static Pages

Your current static pages (`/about`, `/privacy`, `/terms`) will continue to work alongside the new WordPress pages. To fully migrate:

### Option 1: Keep Both (Recommended for Testing)

- Static pages remain at `/about`, `/privacy`, `/terms`
- WordPress pages available at `/pages/about`, `/pages/privacy`, `/pages/terms`

### Option 2: Full Migration

1. **Update menu links** in WordPress to point to `/pages/[slug]`
2. **Update internal links** in your content
3. **Set up redirects** from old static URLs to new WordPress URLs
4. **Remove or repurpose** the old static page files

### Option 3: Hybrid Approach

- Keep high-value pages (About, Contact) as static for performance
- Use WordPress for content-heavy pages (Blog resources, FAQs, etc.)

## Troubleshooting

### Pages Not Showing Up

1. **Check WPGraphQL is working**: Visit `/graphql` and run:
   ```graphql
   query {
     pages {
       nodes {
         slug
         title
       }
     }
   }
   ```

2. **Verify page slugs**: Make sure pages are published and have slugs

3. **Check environment variables**: Ensure `NEXT_PUBLIC_WORDPRESS_URL` is correct

### GraphQL Errors

If you see errors like `"SLUG" does not exist in "PageIdType" enum`:

- The query has been updated to use `idType: URI` which is more compatible
- Make sure you're using the latest version of the code

### Build Warnings

The build may show warnings about pages not being found during static generation. This is normal if WordPress isn't accessible during build time. Pages will still work at runtime.

## Best Practices

1. **Use descriptive slugs**: `about-us` instead of just `about`
2. **Add featured images**: They make pages more engaging
3. **Write excerpts**: They're used for SEO and social sharing
4. **Organize with categories**: Though pages don't have categories, you can use custom taxonomies
5. **Preview before publishing**: Use WordPress preview with the headless setup

## Next Steps

### Content Strategy

- **About Page**: Company story, mission, team
- **Privacy Policy**: GDPR/NDPR compliance
- **Terms of Service**: Legal terms and conditions
- **FAQ Page**: Common questions from clients
- **Resources Page**: Helpful guides and downloads

### Advanced Features

- **Custom page templates**: Create different layouts for different page types
- **Page builders**: Use Gutenberg blocks or ACF Flexible Content
- **Multilingual**: Integrate with WPML or Polylang
- **SEO**: Use Yoast SEO or Rank Math with WPGraphQL

## Support

If you encounter issues:

1. Check the browser console for errors
2. Verify WordPress and WPGraphQL are working
3. Test GraphQL queries in the GraphQL Playground
4. Review the Next.js build logs

## Additional Resources

- [WPGraphQL Documentation](https://www.wpgraphql.com/docs/)
- [Next.js Dynamic Routes](https://nextjs.org/docs/pages/building-your-application/routing/dynamic-routes)
- [Tailwind Typography Plugin](https://tailwindcss.com/docs/typography-plugin)