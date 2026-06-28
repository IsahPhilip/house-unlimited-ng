import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostBySlug, getPostSlugs, getRecentPosts, getSiteSettings } from "@/lib/wordpress";
import { JsonLd } from "@/lib/json-ld";
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
  const settings = await getSiteSettings();
  const [post, recentPosts] = await Promise.all([
    getPostBySlug(slug),
    getRecentPosts(24)
  ]);

  if (!post) {
    notFound();
  }

  const siteUrl = settings.siteUrl;
  const breadcrumbListSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Blog", item: siteUrl + "/blog" },
      { "@type": "ListItem", position: 3, name: post.title, item: siteUrl + "/blog/" + post.slug },
    ],
  };

  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    url: siteUrl + "/blog/" + post.slug,
    datePublished: post.date,
    dateModified: post.modified || post.date,
    author: {
      "@type": "Organization",
      name: settings.title,
      url: siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: settings.title,
      url: siteUrl,
      logo: { "@type": "ImageObject", url: siteUrl + "/site_icon.png" },
    },
    image: post.featuredImage,
    mainEntityOfPage: { "@type": "WebPage", "@id": siteUrl + "/blog/" + post.slug },
  };

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
