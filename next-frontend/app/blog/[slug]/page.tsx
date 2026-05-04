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
    getRecentPosts(8)
  ]);

  if (!post) {
    notFound();
  }

  const relatedPosts = recentPosts.filter((item) => item.slug !== slug).slice(0, 3);

  return <BlogPostClient slug={slug} initialPost={post} initialRelatedPosts={relatedPosts} />;
}
