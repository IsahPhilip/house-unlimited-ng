"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Bookmark,
  Facebook,
  Heart,
  Link2,
  Linkedin,
  MessageCircle,
  Pencil,
  Trash2,
  Twitter
} from "lucide-react";
import type { PostPreview } from "@/lib/wordpress";
import type { BlogComment, InteractiveBlogPost } from "@/lib/blog-api";
import {
  addInteractiveBlogComment,
  bookmarkInteractiveBlogPost,
  deleteInteractiveBlogComment,
  getInteractiveBlogComments,
  getInteractiveBlogInteraction,
  getInteractiveBlogPostBySlug,
  getRelatedInteractiveBlogPosts,
  incrementInteractiveBlogViews,
  likeInteractiveBlogPost,
  unbookmarkInteractiveBlogPost,
  unlikeInteractiveBlogPost,
  updateInteractiveBlogComment
} from "@/lib/blog-api";

type BlogPostClientProps = {
  slug: string;
  initialPost: PostPreview;
  initialRelatedPosts: PostPreview[];
};

type StoredUser = {
  id?: string;
  _id?: string;
  name?: string;
};

function buildShareUrl(platform: "facebook" | "twitter" | "linkedin", slug: string, title: string) {
  const baseUrl = typeof window !== "undefined" ? window.location.origin : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const postUrl = `${baseUrl}/blog/${slug}`;
  const encodedUrl = encodeURIComponent(postUrl);
  const encodedTitle = encodeURIComponent(title);

  switch (platform) {
    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    case "twitter":
      return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
    case "linkedin":
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    default:
      return postUrl;
  }
}

export function BlogPostClient({ slug, initialPost, initialRelatedPosts }: BlogPostClientProps) {
  const [interactivePost, setInteractivePost] = useState<InteractiveBlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<InteractiveBlogPost[]>([]);
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [isCommentsLoading, setIsCommentsLoading] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [currentUser, setCurrentUser] = useState<StoredUser | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser) as StoredUser);
      } catch {
        setCurrentUser(null);
      }
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function hydrateInteractiveData() {
      try {
        const post = await getInteractiveBlogPostBySlug(slug);

        if (!isMounted) {
          return;
        }

        setInteractivePost(post);

        incrementInteractiveBlogViews(post.id)
          .then((views) => {
            if (isMounted) {
              setInteractivePost((prev) => (prev ? { ...prev, views } : prev));
            }
          })
          .catch(() => undefined);

        setIsCommentsLoading(true);

        const [related, loadedComments] = await Promise.all([
          getRelatedInteractiveBlogPosts(post.id, 3),
          getInteractiveBlogComments(post.id)
        ]);

        if (!isMounted) {
          return;
        }

        setRelatedPosts(related);
        setComments(loadedComments);
        setIsCommentsLoading(false);

        const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

        if (token) {
          try {
            const interaction = await getInteractiveBlogInteraction(post.id);

            if (isMounted) {
              setLiked(interaction.liked);
              setBookmarked(interaction.bookmarked);
            }
          } catch {
            if (isMounted) {
              setLiked(false);
              setBookmarked(false);
            }
          }
        }
      } catch {
        if (isMounted) {
          setIsCommentsLoading(false);
        }
      }
    }

    hydrateInteractiveData();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const displayPost = useMemo(() => {
    if (interactivePost) {
      return {
        slug: interactivePost.slug,
        title: interactivePost.title,
        excerpt: interactivePost.excerpt,
        content: interactivePost.content,
        date: interactivePost.date,
        categories: interactivePost.category ? [interactivePost.category] : initialPost.categories,
        featuredImage: interactivePost.image || initialPost.featuredImage,
        author: interactivePost.author?.name || initialPost.author,
        authorRole: interactivePost.author?.role || "",
        authorBio: interactivePost.author?.bio || "",
        authorImage: interactivePost.author?.image || "",
        readTime: interactivePost.readTime,
        views: interactivePost.views,
        likes: interactivePost.likes,
        id: interactivePost.id
      };
    }

    return {
      slug: initialPost.slug,
      title: initialPost.title,
      excerpt: initialPost.excerpt,
      content: initialPost.content || initialPost.excerpt,
      date: initialPost.date,
      categories: initialPost.categories,
      featuredImage: initialPost.featuredImage,
      author: initialPost.author,
      authorRole: "",
      authorBio: "",
      authorImage: "",
      readTime: "5 min read",
      views: 0,
      likes: 0,
      id: ""
    };
  }, [initialPost, interactivePost]);

  const displayRelatedPosts = relatedPosts.length > 0
    ? relatedPosts
    : initialRelatedPosts.map((post) => ({
        id: "",
        slug: post.slug,
        date: post.date,
        category: post.categories[0] || "Blog",
        title: post.title,
        excerpt: post.excerpt,
        content: post.content || "",
        author: post.author ? { name: post.author } : null,
        image: post.featuredImage,
        readTime: "5 min read",
        views: 0,
        likes: 0,
        commentsCount: 0
      }));

  const currentUserId = currentUser?.id || currentUser?._id || "";
  const commentCount = comments.length || interactivePost?.commentsCount || 0;
  const authorInitials =
    displayPost.author
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "NA";

  function requireAuth(message: string) {
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

    if (!token) {
      window.alert(message);
      return false;
    }

    return true;
  }

  async function handleToggleLike() {
    if (!interactivePost?.id || !requireAuth("Please sign in to like this post.")) {
      return;
    }

    try {
      if (liked) {
        const response = await unlikeInteractiveBlogPost(interactivePost.id);
        setLiked(response.liked);
        setInteractivePost((prev) => (prev ? { ...prev, likes: response.likes } : prev));
      } else {
        const response = await likeInteractiveBlogPost(interactivePost.id);
        setLiked(response.liked);
        setInteractivePost((prev) => (prev ? { ...prev, likes: response.likes } : prev));
      }
    } catch {
      window.alert("We couldn't update your like right now.");
    }
  }

  async function handleToggleBookmark() {
    if (!interactivePost?.id || !requireAuth("Please sign in to save this post.")) {
      return;
    }

    try {
      if (bookmarked) {
        const response = await unbookmarkInteractiveBlogPost(interactivePost.id);
        setBookmarked(response.bookmarked);
      } else {
        const response = await bookmarkInteractiveBlogPost(interactivePost.id);
        setBookmarked(response.bookmarked);
      }
    } catch {
      window.alert("We couldn't update your saved state right now.");
    }
  }

  async function handleSubmitComment(event: React.FormEvent) {
    event.preventDefault();

    if (!interactivePost?.id || !requireAuth("Please sign in to comment.")) {
      return;
    }

    if (!commentText.trim()) {
      return;
    }

    try {
      setCommentSubmitting(true);
      const created = await addInteractiveBlogComment(interactivePost.id, commentText.trim());
      setComments((prev) => [created, ...prev]);
      setCommentText("");
    } catch {
      window.alert("We couldn't post your comment right now.");
    } finally {
      setCommentSubmitting(false);
    }
  }

  function handleStartEdit(comment: BlogComment) {
    setEditingCommentId(comment.id);
    setEditingContent(comment.content);
  }

  function handleCancelEdit() {
    setEditingCommentId(null);
    setEditingContent("");
  }

  async function handleSaveEdit(commentId: string) {
    if (!editingContent.trim()) {
      return;
    }

    try {
      const updated = await updateInteractiveBlogComment(commentId, editingContent.trim());
      setComments((prev) => prev.map((comment) => (comment.id === commentId ? updated : comment)));
      setEditingCommentId(null);
      setEditingContent("");
    } catch {
      window.alert("We couldn't update your comment right now.");
    }
  }

  async function handleDeleteComment(commentId: string) {
    try {
      await deleteInteractiveBlogComment(commentId);
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
    } catch {
      window.alert("We couldn't delete your comment right now.");
    }
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/blog/${displayPost.slug}`);
      window.alert("Link copied to clipboard.");
    } catch {
      window.alert("We couldn't copy the link right now.");
    }
  }

  return (
    <div className="bg-white min-h-screen animate-in fade-in duration-500">
      <div className="relative h-[400px] md:h-[500px]">
        {displayPost.featuredImage ? (
          <img src={displayPost.featuredImage} alt={displayPost.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs uppercase tracking-widest">
            No Image
          </div>
        )}
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="max-w-4xl px-4 text-center">
            <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
              {displayPost.categories.length > 0 ? (
                displayPost.categories.map((category) => (
                  <span
                    key={category}
                    className="bg-teal-600 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg"
                  >
                    {category}
                  </span>
                ))
              ) : (
                <span className="bg-teal-600 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                  Blog
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight drop-shadow-lg">
              {displayPost.title}
            </h1>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-white/90">
              <div className="flex items-center space-x-2">
                {displayPost.authorImage ? (
                  <img src={displayPost.authorImage} alt={displayPost.author} className="w-8 h-8 rounded-full border-2 border-white/20 object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full border-2 border-white/20 bg-white/20 flex items-center justify-center text-[10px] font-bold uppercase">
                    {authorInitials}
                  </div>
                )}
                <span className="font-bold text-sm">{displayPost.author || "Unknown Author"}</span>
              </div>
              <span className="hidden md:inline text-white/40">•</span>
              <span className="text-sm font-medium">{displayPost.date}</span>
              <span className="hidden md:inline text-white/40">•</span>
              <span className="text-sm font-medium">{displayPost.readTime}</span>
              <span className="hidden md:inline text-white/40">•</span>
              <span className="text-sm font-medium">{displayPost.views} views</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-4 gap-16">
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-32 space-y-8">
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-6">Share Article</h4>
              <div className="flex flex-col space-y-4">
                <a href={buildShareUrl("facebook", displayPost.slug, displayPost.title)} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-teal-600 hover:text-white transition-all shadow-sm">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href={buildShareUrl("twitter", displayPost.slug, displayPost.title)} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-teal-400 hover:text-white transition-all shadow-sm">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href={buildShareUrl("linkedin", displayPost.slug, displayPost.title)} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-teal-700 hover:text-white transition-all shadow-sm">
                  <Linkedin className="w-5 h-5" />
                </a>
                <button onClick={handleCopyLink} className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                  <Link2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            <Link href="/blog" className="inline-flex items-center text-teal-600 hover:text-teal-700 transition-colors">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Blog
            </Link>
          </div>
        </div>

        <div className="lg:col-span-2">
          <article className="prose prose-lg prose-slate max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-strong:text-gray-900 prose-a:text-teal-600 hover:prose-a:text-teal-700">
            <div dangerouslySetInnerHTML={{ __html: displayPost.content || displayPost.excerpt }} />
          </article>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              className={`flex items-center space-x-2 transition-colors ${liked ? "text-red-500" : "text-gray-600 hover:text-red-500"}`}
              onClick={handleToggleLike}
              disabled={!interactivePost?.id}
            >
              <Heart className="w-4 h-4" />
              <span>{displayPost.likes} Likes</span>
            </button>
            <div className="flex items-center space-x-2 text-gray-600">
              <MessageCircle className="w-4 h-4" />
              <span>{commentCount} Comments</span>
            </div>
            <button
              className={`flex items-center space-x-2 transition-colors ${bookmarked ? "text-teal-600" : "text-gray-600 hover:text-teal-600"}`}
              onClick={handleToggleBookmark}
              disabled={!interactivePost?.id}
            >
              <Bookmark className="w-4 h-4" />
              <span>{bookmarked ? "Saved" : "Save"}</span>
            </button>
          </div>

          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Comments</h3>
              {!currentUser && (
                <span className="text-xs text-gray-500">Sign in to join the discussion.</span>
              )}
            </div>

            <form onSubmit={handleSubmitComment} className="mb-8">
              <textarea
                value={commentText}
                onChange={(event) => setCommentText(event.target.value)}
                placeholder={currentUser ? "Write a thoughtful comment..." : "Sign in to comment"}
                className="w-full min-h-[120px] rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                disabled={!currentUser || commentSubmitting || !interactivePost?.id}
              />
              <div className="mt-3 flex items-center justify-end">
                <button
                  type="submit"
                  className="bg-teal-600 text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm disabled:opacity-60"
                  disabled={!currentUser || commentSubmitting || !commentText.trim() || !interactivePost?.id}
                >
                  {commentSubmitting ? "Posting..." : "Post Comment"}
                </button>
              </div>
            </form>

            {isCommentsLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, idx) => (
                  <div key={idx} className="h-20 bg-gray-100 rounded-2xl animate-pulse"></div>
                ))}
              </div>
            ) : comments.length === 0 ? (
              <div className="text-sm text-gray-500">Be the first to comment.</div>
            ) : (
              <div className="space-y-6">
                {comments.map((comment) => {
                  const isOwner = comment.user?.id === currentUserId;
                  const isEditing = editingCommentId === comment.id;

                  return (
                    <div key={comment.id} className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          {comment.user?.avatar ? (
                            <img src={comment.user.avatar} alt={comment.user.name} className="w-10 h-10 rounded-full object-cover" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-bold">
                              {comment.user?.name?.split(" ").map((part) => part[0]).join("").slice(0, 2) || "NA"}
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-bold text-gray-900">{comment.user?.name || "Anonymous"}</div>
                            <div className="text-xs text-gray-400">
                              {new Date(comment.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric"
                              })}
                            </div>
                          </div>
                        </div>

                        {isOwner && (
                          <div className="flex items-center gap-2">
                            <button type="button" className="text-gray-500 hover:text-teal-600" onClick={() => handleStartEdit(comment)}>
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button type="button" className="text-gray-500 hover:text-red-500" onClick={() => handleDeleteComment(comment.id)}>
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="mt-4">
                        {isEditing ? (
                          <div className="space-y-3">
                            <textarea
                              value={editingContent}
                              onChange={(event) => setEditingContent(event.target.value)}
                              className="w-full min-h-[100px] rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                            />
                            <div className="flex items-center justify-end gap-2">
                              <button type="button" className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-500" onClick={handleCancelEdit}>
                                Cancel
                              </button>
                              <button type="button" className="bg-teal-600 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest" onClick={() => handleSaveEdit(comment.id)} disabled={!editingContent.trim()}>
                                Save
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-600 leading-relaxed">{comment.content}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-16 pt-12 border-t border-gray-100">
            <div className="bg-gray-50 p-8 rounded-3xl flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
              {displayPost.authorImage ? (
                <img src={displayPost.authorImage} alt={displayPost.author} className="w-24 h-24 rounded-3xl object-cover shadow-xl" />
              ) : (
                <div className="w-24 h-24 rounded-3xl bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-600">
                  {authorInitials}
                </div>
              )}
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-1">{displayPost.author || "Unknown Author"}</h4>
                {displayPost.authorRole ? (
                  <p className="text-teal-600 text-xs font-bold uppercase tracking-widest mb-3">{displayPost.authorRole}</p>
                ) : (
                  <p className="text-teal-600 text-xs font-bold uppercase tracking-widest mb-3">Editorial Team</p>
                )}
                <p className="text-gray-500 text-sm leading-relaxed italic">
                  {displayPost.authorBio || "House Unlimited Nigeria shares practical real estate updates, market intelligence, and property guidance for buyers, sellers, and investors."}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-32">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-8">Related Articles</h4>
            <div className="space-y-8">
              {displayRelatedPosts.map((relatedPost) => (
                <Link key={`${relatedPost.slug}-${relatedPost.id}`} href={`/blog/${relatedPost.slug}`} className="group block">
                  <div className="aspect-video rounded-2xl overflow-hidden mb-4 shadow-sm">
                    {relatedPost.image ? (
                      <img src={relatedPost.image} alt={relatedPost.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-[10px] uppercase tracking-widest">
                        No Image
                      </div>
                    )}
                  </div>
                  <h5 className="font-bold text-gray-900 text-sm leading-snug group-hover:text-teal-600 transition-colors">
                    {relatedPost.title}
                  </h5>
                  <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-wider">{relatedPost.date}</p>
                </Link>
              ))}
            </div>

            <div className="mt-12 bg-teal-600 rounded-3xl p-8 text-white">
              <h4 className="text-lg font-bold mb-4">Want more insights?</h4>
              <p className="text-teal-100 text-xs leading-relaxed mb-6">Join the conversation, ask questions, and get practical guidance from our property team.</p>
              <Link href="/contact" className="block w-full bg-white text-teal-600 py-3 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg text-center">
                Talk to Our Team
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
