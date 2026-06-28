const fs = require('fs');

const listingFile = 'next-frontend/app/blog/page.tsx';
let listing = fs.readFileSync(listingFile, 'utf8');

if (!listing.includes('import { JsonLd }')) {
  listing = listing.replace(
    'import { BlogIndexClient } from "./blog-index-client";',
    'import { JsonLd } from "@/lib/json-ld";\nimport { BlogIndexClient } from "./blog-index-client";'
  );
}

if (!listing.includes('const collectionPageSchema')) {
  const listingMarker =
    'export default async function BlogIndexPage() {\n' +
    '  const [posts, categories] = await Promise.all([\n' +
    '    getRecentPosts(100),\n' +
    '    getBlogCategories()\n' +
    '  ]);\n' +
    '\n' +
    '  return <BlogIndexClient';

  const listingReplacement =
    'export default async function BlogIndexPage() {\n' +
    '  const settings = await getSiteSettings();\n' +
    '  const [posts, categories] = await Promise.all([\n' +
    '    getRecentPosts(100),\n' +
    '    getBlogCategories()\n' +
    '  ]);\n' +
    '\n' +
    '  const breadcrumbListSchema = {\n' +
    '    "@context": "https://schema.org",\n' +
    '    "@type": "BreadcrumbList",\n' +
    '    itemListElement: [\n' +
    '      { "@type": "ListItem", position: 1, name: "Home", item: settings.siteUrl },\n' +
    '      { "@type": "ListItem", position: 2, name: "Blog", item: settings.siteUrl + "/blog" },\n' +
    '    ],\n' +
    '  };\n' +
    '\n' +
    '  const collectionPageSchema = {\n' +
    '    "@context": "https://schema.org",\n' +
    '    "@type": "CollectionPage",\n' +
    '    name: settings.title + " - Blog",\n' +
    '    description: "Expert real estate insights, property buying guides, and investment tips.",\n' +
    '    url: settings.siteUrl + "/blog",\n' +
    '    isPartOf: {\n' +
    '      "@type": "WebSite",\n' +
    '      name: settings.title,\n' +
    '      url: settings.siteUrl,\n' +
    '    },\n' +
    '  };\n' +
    '\n' +
    '  return (\n' +
    '    <>\n' +
    '      <JsonLd data={breadcrumbListSchema} id="blog-breadcrumb-jsonld" />\n' +
    '      <JsonLd data={collectionPageSchema} id="blog-collection-jsonld" />\n' +
    '      <BlogIndexClient';

  if (listing.includes(listingMarker)) {
    listing = listing.replace(listingMarker, listingReplacement);
    fs.writeFileSync(listingFile, listing, 'utf8');
    console.log('injected blog listing');
  } else {
    console.log('blog listing marker not found');
  }
}

const postFile = 'next-frontend/app/blog/[slug]/page.tsx';
let post = fs.readFileSync(postFile, 'utf8');

if (!post.includes('import { JsonLd }')) {
  post = post.replace(
    'import { getPostBySlug, getPostSlugs, getRecentPosts } from "@/lib/wordpress";',
    'import { getPostBySlug, getPostSlugs, getRecentPosts, getSiteSettings } from "@/lib/wordpress";\nimport { JsonLd } from "@/lib/json-ld";'
  );
}

if (!post.includes('const breadcrumbListSchema') && post.includes('export default async function BlogPostPage')) {
  const postMarker =
    'export default async function BlogPostPage({ params }: BlogPostPageProps) {\n' +
    '  const { slug } = await params;\n' +
    '  const [post, recentPosts] = await Promise.all([\n' +
    '    getPostBySlug(slug),\n' +
    '    getRecentPosts(24)\n' +
    '  ]);\n' +
    '\n' +
    '  if (!post) {\n' +
    '    notFound();\n' +
    '  }\n' +
    '\n' +
    '  const postCategories = new Set(post.categories.map((item) => item.toLowerCase()));\n' +
    '  const postTags = new Set(post.tags.map((item) => item.toLowerCase()));\n' +
    '\n' +
    '  const relatedPosts = recentPosts';

  const postReplacement =
    'export default async function BlogPostPage({ params }: BlogPostPageProps) {\n' +
    '  const { slug } = await params;\n' +
    '  const settings = await getSiteSettings();\n' +
    '  const [post, recentPosts] = await Promise.all([\n' +
    '    getPostBySlug(slug),\n' +
    '    getRecentPosts(24)\n' +
    '  ]);\n' +
    '\n' +
    '  if (!post) {\n' +
    '    notFound();\n' +
    '  }\n' +
    '\n' +
    '  const siteUrl = settings.siteUrl;\n' +
    '  const breadcrumbListSchema = {\n' +
    '    "@context": "https://schema.org",\n' +
    '    "@type": "BreadcrumbList",\n' +
    '    itemListElement: [\n' +
    '      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },\n' +
    '      { "@type": "ListItem", position: 2, name: "Blog", item: siteUrl + "/blog" },\n' +
    '      { "@type": "ListItem", position: 3, name: post.title, item: siteUrl + "/blog/" + post.slug },\n' +
    '    ],\n' +
    '  };\n' +
    '\n' +
    '  const blogPostingSchema = {\n' +
    '    "@context": "https://schema.org",\n' +
    '    "@type": "BlogPosting",\n' +
    '    headline: post.title,\n' +
    '    description: post.excerpt,\n' +
    '    url: siteUrl + "/blog/" + post.slug,\n' +
    '    datePublished: post.date,\n' +
    '    dateModified: post.modified || post.date,\n' +
    '    author: {\n' +
    '      "@type": "Organization",\n' +
    '      name: settings.title,\n' +
    '      url: siteUrl,\n' +
    '    },\n' +
    '    publisher: {\n' +
    '      "@type": "Organization",\n' +
    '      name: settings.title,\n' +
    '      url: siteUrl,\n' +
    '      logo: { "@type": "ImageObject", url: siteUrl + "/site_icon.png" },\n' +
    '    },\n' +
    '    image: post.featuredImage,\n' +
    '    mainEntityOfPage: { "@type": "WebPage", "@id": siteUrl + "/blog/" + post.slug },\n' +
    '  };\n' +
    '\n' +
    '  const postCategories = new Set(post.categories.map((item) => item.toLowerCase()));\n' +
    '  const postTags = new Set(post.tags.map((item) => item.toLowerCase()));\n' +
    '\n' +
    '  const relatedPosts = recentPosts';

  if (post.includes(postMarker)) {
    post = post.replace(postMarker, postReplacement);
    fs.writeFileSync(postFile, post, 'utf8');
    console.log('injected blog post');
  } else {
    console.log('blog post marker not found');
  }
}
