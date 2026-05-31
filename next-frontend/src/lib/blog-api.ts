export type InteractiveBlogPost = {
  id: string;
  slug: string;
  date: string;
  category: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    role?: string;
    image?: string;
    bio?: string;
  } | null;
  image?: string;
  readTime: string;
  views: number;
  likes: number;
  commentsCount: number;
};

export type BlogComment = {
  id: string;
  content: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
    role?: string;
  } | null;
  createdAt: string;
  updatedAt: string;
};

const API_BASE_URL = "/api/blog";
const VISITOR_STORAGE_KEY = "hunBlogVisitorId";

export function getBlogVisitorId() {
  if (typeof window === "undefined") {
    return "";
  }

  const stored = window.localStorage.getItem(VISITOR_STORAGE_KEY);

  if (stored) {
    return stored;
  }

  const generated =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  window.localStorage.setItem(VISITOR_STORAGE_KEY, generated);
  return generated;
}

function buildJsonHeaders() {
  return {
    "Content-Type": "application/json"
  };
}

function formatBlogPost(post: any): InteractiveBlogPost {
  return {
    id: post.id,
    slug: post.slug,
    date: new Date(post.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    }),
    category: post.category,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    author: post.author
      ? {
          name: post.author.name,
          role: post.author.role,
          image: post.author.image,
          bio: post.author.bio
        }
      : null,
    image: post.image || post.featuredImage || undefined,
    readTime: post.readTime || "5 min read",
    views: post.views || 0,
    likes: post.likes || 0,
    commentsCount: post.commentsCount || 0
  };
}

export async function getInteractiveBlogPostBySlug(slug: string): Promise<InteractiveBlogPost> {
  const response = await fetch(`${API_BASE_URL}/blog/public/slug/${encodeURIComponent(slug)}`);

  if (!response.ok) {
    throw new Error("Failed to fetch interactive blog post");
  }

  const post = await response.json();
  return formatBlogPost(post);
}

export async function getRelatedInteractiveBlogPosts(id: string, limit = 3): Promise<InteractiveBlogPost[]> {
  const response = await fetch(`${API_BASE_URL}/blog/public/${id}/related?limit=${limit}`);

  if (!response.ok) {
    throw new Error("Failed to fetch related blog posts");
  }

  const posts = await response.json();
  return posts.map(formatBlogPost);
}

export async function incrementInteractiveBlogViews(id: string): Promise<number> {
  const response = await fetch(`${API_BASE_URL}/blog/public/${id}/views`, {
    method: "PATCH"
  });

  if (!response.ok) {
    throw new Error("Failed to increment blog views");
  }

  const data = await response.json();
  return data.views;
}

export async function getInteractiveBlogComments(id: string): Promise<BlogComment[]> {
  const response = await fetch(`${API_BASE_URL}/blog/public/${id}/comments`);

  if (!response.ok) {
    throw new Error("Failed to fetch blog comments");
  }

  return await response.json();
}

export async function addInteractiveBlogComment(
  id: string,
  content: string,
  guestName?: string,
  userName?: string
): Promise<BlogComment> {
  const visitorId = getBlogVisitorId();
  const response = await fetch(`${API_BASE_URL}/blog/public/${id}/comments`, {
    method: "POST",
    headers: buildJsonHeaders(),
    body: JSON.stringify({
      content,
      visitorId,
      ...(guestName ? { guestName } : {}),
      ...(userName ? { userName } : {})
    })
  });

  if (!response.ok) {
    throw new Error("Failed to add blog comment");
  }

  return await response.json();
}

export async function updateInteractiveBlogComment(commentId: string, content: string): Promise<BlogComment> {
  const visitorId = getBlogVisitorId();
  const response = await fetch(`${API_BASE_URL}/blog/public/comments/${commentId}`, {
    method: "PUT",
    headers: buildJsonHeaders(),
    body: JSON.stringify({ content, visitorId })
  });

  if (!response.ok) {
    throw new Error("Failed to update blog comment");
  }

  return await response.json();
}

export async function deleteInteractiveBlogComment(commentId: string): Promise<void> {
  const visitorId = getBlogVisitorId();
  const response = await fetch(`${API_BASE_URL}/blog/public/comments/${commentId}`, {
    method: "DELETE",
    headers: buildJsonHeaders(),
    body: JSON.stringify({ visitorId })
  });

  if (!response.ok) {
    throw new Error("Failed to delete blog comment");
  }
}

export async function getInteractiveBlogInteraction(id: string): Promise<{ liked: boolean; bookmarked: boolean }> {
  const visitorId = getBlogVisitorId();
  const response = await fetch(`${API_BASE_URL}/blog/public/${id}/interaction?visitorId=${encodeURIComponent(visitorId)}`);

  if (!response.ok) {
    throw new Error("Failed to fetch blog interaction");
  }

  return await response.json();
}

export async function likeInteractiveBlogPost(id: string): Promise<{ liked: boolean; likes: number }> {
  const visitorId = getBlogVisitorId();
  const response = await fetch(`${API_BASE_URL}/blog/public/${id}/like`, {
    method: "POST",
    headers: buildJsonHeaders(),
    body: JSON.stringify({ visitorId })
  });

  if (!response.ok) {
    throw new Error("Failed to like blog post");
  }

  return await response.json();
}

export async function unlikeInteractiveBlogPost(id: string): Promise<{ liked: boolean; likes: number }> {
  const visitorId = getBlogVisitorId();
  const response = await fetch(`${API_BASE_URL}/blog/public/${id}/like`, {
    method: "DELETE",
    headers: buildJsonHeaders(),
    body: JSON.stringify({ visitorId })
  });

  if (!response.ok) {
    throw new Error("Failed to unlike blog post");
  }

  return await response.json();
}

export async function bookmarkInteractiveBlogPost(id: string): Promise<{ bookmarked: boolean }> {
  const visitorId = getBlogVisitorId();
  const response = await fetch(`${API_BASE_URL}/blog/public/${id}/bookmark`, {
    method: "POST",
    headers: buildJsonHeaders(),
    body: JSON.stringify({ visitorId })
  });

  if (!response.ok) {
    throw new Error("Failed to bookmark blog post");
  }

  return await response.json();
}

export async function unbookmarkInteractiveBlogPost(id: string): Promise<{ bookmarked: boolean }> {
  const visitorId = getBlogVisitorId();
  const response = await fetch(`${API_BASE_URL}/blog/public/${id}/bookmark`, {
    method: "DELETE",
    headers: buildJsonHeaders(),
    body: JSON.stringify({ visitorId })
  });

  if (!response.ok) {
    throw new Error("Failed to remove blog bookmark");
  }

  return await response.json();
}
