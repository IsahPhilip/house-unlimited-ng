import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostBySlug, getPostSlugs, getRecentPosts } from "@/lib/wordpress";
import { BlogPostClient } from "./blog-post-client";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found"
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      images: post.featuredImage ? [post.featuredImage] : []
    }
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const [post, recentPosts] = await Promise.all([
    getPostBySlug(slug),
    getRecentPosts(24)
  ]);

  if (!post) {
    notFound();
  }

  const postCategories = new Set(post.categories.map((item) => item.toLowerCase()));
  const postTags = new Set(post.tags.map((item) => item.toLowerCase()));

  const relatedPosts = recentPosts
    .filter((item) => item.slug !== slug)
    .map((item) => {
      const categoryMatches = item.categories.filter((category) => postCategories.has(category.toLowerCase())).length;
      const tagMatches = item.tags.filter((tag) => postTags.has(tag.toLowerCase())).length;

      return {
        item,
        score: categoryMatches * 3 + tagMatches * 2
      };
    })
    .sort((left, right) => right.score - left.score)
    .map((entry) => entry.item)
    .slice(0, 3);

  return <BlogPostClient slug={slug} initialPost={post} initialRelatedPosts={relatedPosts} />;
}
