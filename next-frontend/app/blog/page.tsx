import type { Metadata } from "next";
import { JsonLd } from "@/lib/json-ld";
import { BlogIndexClient } from "./blog-index-client";
import { getBlogCategories, getRecentPosts, getSiteSettings } from "@/lib/wordpress";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    title: "Real Estate Blog & Property Insights | House Unlimited Nigeria",
    description: `Read expert real estate insights, property buying guides, market updates, and investment tips from ${settings.title}. Stay informed about Abuja property trends.`,
    openGraph: {
      title: "Real Estate Blog & Property Insights | House Unlimited Nigeria",
      description: `Expert real estate insights, property buying guides, market updates, and investment tips from ${settings.title}.`
    }
  };
}

export default async function BlogIndexPage() {
  const settings = await getSiteSettings();
  const [posts, categories] = await Promise.all([
    getRecentPosts(100),
    getBlogCategories()
  ]);

  const breadcrumbListSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: settings.siteUrl },
      { "@type": "ListItem", position: 2, name: "Blog", item: settings.siteUrl + "/blog" },
    ],
  };

  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: settings.title + " - Blog",
    description: "Expert real estate insights, property buying guides, and investment tips.",
    url: settings.siteUrl + "/blog",
    isPartOf: {
      "@type": "WebSite",
      name: settings.title,
      url: settings.siteUrl,
    },
  };

  return (
    <>
      <JsonLd data={breadcrumbListSchema} id="blog-breadcrumb-jsonld" />
      <JsonLd data={collectionPageSchema} id="blog-collection-jsonld" />
      <BlogIndexClient posts={posts} categories={categories} />;
}
