import { NextResponse } from "next/server";

const WORDPRESS_BASE_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || "http://localhost/wordpress";
const WORDPRESS_BLOG_API_BASE = `${WORDPRESS_BASE_URL}/wp-json/hun/v1`;
const WORDPRESS_REST_API_BASE = `${WORDPRESS_BASE_URL}/wp-json/wp/v2`;

type RouteContext = {
  params: {
    path: string[];
  };
};

async function proxyRequest(request: Request, context: RouteContext) {
  const { path } = context.params;
  const targetUrl = new URL(`${WORDPRESS_BLOG_API_BASE}/${path.join("/")}`);
  targetUrl.search = new URL(request.url).search;

  const headers = new Headers(request.headers);
  headers.delete("host");
  headers.delete("content-length");
  headers.delete("connection");
  headers.delete("accept-encoding");

  const init: RequestInit = {
    method: request.method,
    headers,
    redirect: "manual"
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = await request.arrayBuffer();
  }

  const response = await fetch(targetUrl, init);

  if (!response.ok && request.method === "GET") {
    const fallback = await fallbackReadRequest(path, request);

    if (fallback) {
      return fallback;
    }
  }

  const responseHeaders = new Headers(response.headers);

  responseHeaders.delete("transfer-encoding");
  responseHeaders.delete("content-encoding");
  responseHeaders.delete("connection");

  return new NextResponse(response.body, {
    status: response.status,
    headers: responseHeaders
  });
}

function toInteractivePost(post: any) {
  const categories = post?._embedded?.["wp:term"]?.flat?.()?.filter?.((term: any) => term?.taxonomy === "category") || [];
  const firstCategory = categories[0]?.name || "Blog";
  const author = post?._embedded?.author?.[0];

  return {
    id: String(post.id),
    slug: post.slug,
    createdAt: post.date_gmt || post.date,
    category: firstCategory,
    title: post.title?.rendered || "Untitled post",
    excerpt: post.excerpt?.rendered || "",
    content: post.content?.rendered || "",
    author: author
      ? {
          name: author.name || "Unknown Author",
          role: "",
          image: author.avatar_urls?.[96] || author.avatar_urls?.[48] || "",
          bio: author.description || ""
        }
      : null,
    image: post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "",
    readTime: "5 min read",
    views: 0,
    likes: 0,
    commentsCount: post.comment_status === "open" ? Number(post.comment_count || 0) : 0
  };
}

function toInteractiveComment(comment: any) {
  return {
    id: String(comment.id),
    content: comment.content?.rendered || "",
    user: {
      id: String(comment.author || comment.id),
      name: comment.author_name || "Anonymous",
      avatar: comment.author_avatar_urls?.[96] || comment.author_avatar_urls?.[48] || null,
      role: ""
    },
    createdAt: comment.date_gmt || comment.date,
    updatedAt: comment.modified_gmt || comment.modified || comment.date_gmt || comment.date
  };
}

async function fallbackReadRequest(path: string[], request: Request) {
  const [section, collection, third, fourth] = path;

  if (section !== "blog" || collection !== "public") {
    return null;
  }

  if (third === "slug" && fourth) {
    const url = new URL(`${WORDPRESS_REST_API_BASE}/posts`);
    url.searchParams.set("slug", fourth);
    url.searchParams.set("_embed", "1");

    const response = await fetch(url, { method: "GET" });

    if (!response.ok) {
      return null;
    }

    const posts = (await response.json()) as any[];
    if (!Array.isArray(posts) || posts.length === 0) {
      return null;
    }

    return NextResponse.json(toInteractivePost(posts[0]));
  }

  if (third && fourth === "related") {
    const postId = Number(third);
    const url = new URL(`${WORDPRESS_REST_API_BASE}/posts`);
    url.searchParams.set("per_page", "24");
    url.searchParams.set("exclude", String(postId));
    url.searchParams.set("_embed", "1");

    const response = await fetch(url, { method: "GET" });

    if (!response.ok) {
      return null;
    }

    const posts = (await response.json()) as any[];
    return NextResponse.json(posts.map(toInteractivePost));
  }

  if (third && fourth === "comments") {
    const postId = Number(third);
    const url = new URL(`${WORDPRESS_REST_API_BASE}/comments`);
    url.searchParams.set("post", String(postId));
    url.searchParams.set("per_page", "100");
    url.searchParams.set("orderby", "date");
    url.searchParams.set("order", "desc");

    const response = await fetch(url, { method: "GET" });

    if (!response.ok) {
      return null;
    }

    const comments = (await response.json()) as any[];
    return NextResponse.json(comments.map(toInteractiveComment));
  }

  return null;
}

export async function GET(request: Request, context: RouteContext) {
  return proxyRequest(request, context);
}

export async function POST(request: Request, context: RouteContext) {
  return proxyRequest(request, context);
}

export async function PUT(request: Request, context: RouteContext) {
  return proxyRequest(request, context);
}

export async function PATCH(request: Request, context: RouteContext) {
  return proxyRequest(request, context);
}

export async function DELETE(request: Request, context: RouteContext) {
  return proxyRequest(request, context);
}
