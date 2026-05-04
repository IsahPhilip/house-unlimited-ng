import type { Metadata } from "next";
import { BlogIndexClient } from "./blog-index-client";
import { getBlogCategories, getRecentPosts, getSiteSettings } from "@/lib/wordpress";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    title: "Blog",
    description: `Insights, property news, and editorial updates from ${settings.title}.`
  };
}

export default async function BlogIndexPage() {
  const [posts, categories] = await Promise.all([
    getRecentPosts(100),
    getBlogCategories()
  ]);

  return <BlogIndexClient posts={posts} categories={categories} />;
}
