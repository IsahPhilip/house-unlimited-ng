import type { Metadata } from "next";
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
  const [posts, categories] = await Promise.all([
    getRecentPosts(100),
    getBlogCategories()
  ]);

  return <BlogIndexClient posts={posts} categories={categories} />;
}
