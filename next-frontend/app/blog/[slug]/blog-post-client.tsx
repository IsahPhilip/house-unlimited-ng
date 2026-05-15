"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Bookmark,
  Check,
  Facebook,
  Heart,
  Link2,
  Linkedin,
  Loader2,
  MessageCircle,
  Pencil,
  Share2,
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

type DisplayRelatedPost = {
  id: string;
  slug: string;
  date: string;
  category?: string;
  tags: string[];
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
  } | null;
  image?: string;
  readTime: string;
  views: number;
  likes: number;
  commentsCount: number;
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
  const [isLikePending, setIsLikePending] = useState(false);
  const [isBookmarkPending, setIsBookmarkPending] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [guestName, setGuestName] = useState("");
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [isCommentsLoading, setIsCommentsLoading] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [currentUser, setCurrentUser] = useState<StoredUser | null>(null);
  const [commentSort, setCommentSort] = useState<"newest" | "oldest">("newest");
  const [feedback, setFeedback] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);
  const commentsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!feedback) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setFeedback(null);
    }, 2600);

    return () => window.clearTimeout(timeout);
  }, [feedback]);

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
        tags: initialPost.tags,
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
      tags: initialPost.tags,
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

  const displayRelatedPosts: DisplayRelatedPost[] = relatedPosts.length > 0
    ? relatedPosts.map((post) => ({
        id: post.id,
        slug: post.slug,
        date: post.date,
        category: post.category,
        tags: [],
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        author: post.author ? { name: post.author.name } : null,
        image: post.image,
        readTime: post.readTime,
        views: post.views,
        likes: post.likes,
        commentsCount: post.commentsCount
      }))
    : initialRelatedPosts.map((post) => ({
        id: "",
        slug: post.slug,
        date: post.date,
        category: post.categories[0] || "Blog",
        tags: post.tags,
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
  const isSignedIn = Boolean(currentUserId);
  const commentCount = comments.length || interactivePost?.commentsCount || 0;
  const visibleComments = useMemo(() => {
    const sorted = [...comments];
    sorted.sort((left, right) => {
      const leftTime = new Date(left.createdAt).getTime();
      const rightTime = new Date(right.createdAt).getTime();

      return commentSort === "newest" ? rightTime - leftTime : leftTime - rightTime;
    });

    return sorted;
  }, [commentSort, comments]);
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
      setFeedback({ type: "info", text: message });
      return false;
    }

    return true;
  }

  function scrollToComments() {
    commentsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function handleToggleLike() {
    if (!interactivePost?.id) {
      setFeedback({ type: "info", text: "This post is still loading. Please try again in a moment." });
      return;
    }

    if (!requireAuth("Please sign in to like this post.")) {
      return;
    }

    try {
      setIsLikePending(true);

      if (liked) {
        const response = await unlikeInteractiveBlogPost(interactivePost.id);
        setLiked(response.liked);
        setInteractivePost((prev) => (prev ? { ...prev, likes: response.likes } : prev));
        setFeedback({ type: "success", text: "Like removed." });
      } else {
        const response = await likeInteractiveBlogPost(interactivePost.id);
        setLiked(response.liked);
        setInteractivePost((prev) => (prev ? { ...prev, likes: response.likes } : prev));
        setFeedback({ type: "success", text: "Post liked." });
      }
    } catch {
      setFeedback({ type: "error", text: "We couldn't update your like right now." });
    } finally {
      setIsLikePending(false);
    }
  }

  async function handleToggleBookmark() {
    if (!interactivePost?.id) {
      setFeedback({ type: "info", text: "This post is still loading. Please try again in a moment." });
      return;
    }

    if (!requireAuth("Please sign in to save this post.")) {
      return;
    }

    try {
      setIsBookmarkPending(true);

      if (bookmarked) {
        const response = await unbookmarkInteractiveBlogPost(interactivePost.id);
        setBookmarked(response.bookmarked);
        setFeedback({ type: "success", text: "Removed from saved posts." });
      } else {
        const response = await bookmarkInteractiveBlogPost(interactivePost.id);
        setBookmarked(response.bookmarked);
        setFeedback({ type: "success", text: "Saved for later." });
      }
    } catch {
      setFeedback({ type: "error", text: "We couldn't update your saved state right now." });
    } finally {
      setIsBookmarkPending(false);
    }
  }

  async function handleSubmitComment(event: React.FormEvent) {
    event.preventDefault();

    if (!interactivePost?.id) {
      setFeedback({ type: "info", text: "Comments are still loading. Please try again in a moment." });
      return;
    }

    if (!commentText.trim()) {
      return;
    }

    const trimmedGuestName = guestName.trim();

    if (!isSignedIn && !trimmedGuestName) {
      setFeedback({ type: "info", text: "Please enter your name to post as a guest." });
      return;
    }

    try {
      setCommentSubmitting(true);
      const created = await addInteractiveBlogComment(
        interactivePost.id,
        commentText.trim(),
        isSignedIn ? undefined : trimmedGuestName
      );
      setComments((prev) => [created, ...prev]);
      setCommentText("");
      if (!isSignedIn) {
        setGuestName("");
      }
      setFeedback({ type: "success", text: "Comment posted successfully." });
    } catch {
      setFeedback({ type: "error", text: "We couldn't post your comment right now." });
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
      setFeedback({ type: "success", text: "Comment updated." });
    } catch {
      setFeedback({ type: "error", text: "We couldn't update your comment right now." });
    }
  }

  async function handleDeleteComment(commentId: string) {
    if (typeof window !== "undefined" && !window.confirm("Delete this comment?")) {
      return;
    }

    try {
      await deleteInteractiveBlogComment(commentId);
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
      setFeedback({ type: "success", text: "Comment deleted." });
    } catch {
      setFeedback({ type: "error", text: "We couldn't delete your comment right now." });
    }
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/blog/${displayPost.slug}`);
      setFeedback({ type: "success", text: "Link copied to clipboard." });
    } catch {
      setFeedback({ type: "error", text: "We couldn't copy the link right now." });
    }
  }

  async function handleShare() {
    const shareUrl = `${window.location.origin}/blog/${displayPost.slug}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: displayPost.title,
          text: displayPost.excerpt,
          url: shareUrl
        });
        setFeedback({ type: "success", text: "Article shared." });
        return;
      } catch {
        return;
      }
    }

    await handleCopyLink();
  }

  return (
    <div className="bg-white min-h-screen animate-in fade-in duration-500">
      <div className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,85,85,0.34),transparent_32rem),linear-gradient(135deg,#031314_0%,#052628_55%,#0b1727_100%)]"></div>
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:32px_32px]"></div>
        <div className="absolute -left-20 top-12 h-56 w-56 rounded-full bg-[#005555]/25 blur-3xl"></div>
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-cyan-300/10 blur-3xl"></div>
        <div className="relative flex min-h-[400px] items-center justify-center px-4 py-24 md:min-h-[500px]">
          <div className="max-w-4xl px-4 text-center">
            <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
              {displayPost.categories.length > 0 ? (
                displayPost.categories.map((category) => (
                  <span
                    key={category}
                    className="bg-[#005555] text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg"
                  >
                    {category}
                  </span>
                ))
              ) : (
                <span className="bg-[#005555] text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
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
                <a href={buildShareUrl("facebook", displayPost.slug, displayPost.title)} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-[#005555] hover:text-white transition-all shadow-sm">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href={buildShareUrl("twitter", displayPost.slug, displayPost.title)} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-[#005555] hover:text-white transition-all shadow-sm">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href={buildShareUrl("linkedin", displayPost.slug, displayPost.title)} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-[#005555] hover:text-white transition-all shadow-sm">
                  <Linkedin className="w-5 h-5" />
                </a>
                <button onClick={handleCopyLink} className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-[#005555] hover:text-white transition-all shadow-sm">
                  <Link2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            <Link href="/blog" className="inline-flex items-center text-[#005555] hover:text-[#005555] transition-colors">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Blog
            </Link>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="mb-8 rounded-3xl border border-gray-100 bg-gray-50 p-4 md:p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    liked ? "bg-red-50 text-red-500" : "bg-white text-gray-600 hover:text-red-500"
                  }`}
                  onClick={handleToggleLike}
                  disabled={isLikePending}
                >
                  {isLikePending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Heart className="h-4 w-4" />}
                  <span>{displayPost.likes} Likes</span>
                </button>
                <button
                  className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-600 transition-colors hover:text-[#005555]"
                  onClick={scrollToComments}
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>{commentCount} Comments</span>
                </button>
                <button
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    bookmarked ? "bg-[#d8eeee] text-[#005555]" : "bg-white text-gray-600 hover:text-[#005555]"
                  }`}
                  onClick={handleToggleBookmark}
                  disabled={isBookmarkPending}
                >
                  {isBookmarkPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bookmark className="h-4 w-4" />}
                  <span>{bookmarked ? "Saved" : "Save"}</span>
                </button>
              </div>

              <button
                className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-600 transition-colors hover:text-[#005555]"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </button>
            </div>

            {feedback && (
              <div
                className={`mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider ${
                  feedback.type === "success"
                    ? "bg-[#d8eeee] text-[#005555]"
                    : feedback.type === "error"
                      ? "bg-red-50 text-red-600"
                      : "bg-slate-100 text-slate-700"
                }`}
              >
                {feedback.type === "success" ? <Check className="h-3.5 w-3.5" /> : null}
                <span>{feedback.text}</span>
              </div>
            )}
          </div>

          {displayPost.featuredImage && (
            <figure className="mb-10 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
              <img
                src={displayPost.featuredImage}
                alt={displayPost.title}
                className="h-auto w-full object-cover"
              />
            </figure>
          )}

          <article className="wp-content prose prose-lg prose-slate max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-strong:text-gray-900 prose-a:text-[#005555] hover:prose-a:text-[#005555]">
            <div dangerouslySetInnerHTML={{ __html: displayPost.content || displayPost.excerpt }} />
          </article>

          {displayPost.tags.length > 0 && (
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">Topics</span>
              {displayPost.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-[#d8eeee] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#005555]">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div ref={commentsRef} className="mt-12">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Comments</h3>
              </div>
              <div className="inline-flex w-fit rounded-full bg-gray-100 p-1">
                <button
                  type="button"
                  onClick={() => setCommentSort("newest")}
                  className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                    commentSort === "newest" ? "bg-white text-[#005555] shadow-sm" : "text-gray-500"
                  }`}
                >
                  Newest
                </button>
                <button
                  type="button"
                  onClick={() => setCommentSort("oldest")}
                  className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                    commentSort === "oldest" ? "bg-white text-[#005555] shadow-sm" : "text-gray-500"
                  }`}
                >
                  Oldest
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmitComment} className="mb-8">
              {!isSignedIn && (
                <input
                  type="text"
                  value={guestName}
                  onChange={(event) => setGuestName(event.target.value)}
                  placeholder="Your name"
                  className="w-full mb-3 rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#005555] focus:border-[#005555]"
                  maxLength={80}
                  disabled={commentSubmitting}
                />
              )}
              <textarea
                value={commentText}
                onChange={(event) => setCommentText(event.target.value)}
                placeholder="Write a thoughtful comment..."
                className="w-full min-h-[120px] rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#005555] focus:border-[#005555]"
                disabled={commentSubmitting}
                maxLength={800}
              />
              <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-gray-400">{commentText.trim().length}/800 characters</p>
                <button
                  type="submit"
                  className="bg-[#005555] text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm disabled:opacity-60"
                  disabled={commentSubmitting || !commentText.trim() || (!isSignedIn && !guestName.trim())}
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
                {visibleComments.map((comment) => {
                  const isOwner = comment.user?.id === currentUserId;
                  const isEditing = editingCommentId === comment.id;

                  return (
                    <div key={comment.id} className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          {comment.user?.avatar ? (
                            <img src={comment.user.avatar} alt={comment.user.name} className="w-10 h-10 rounded-full object-cover" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-[#005555] text-[#005555] flex items-center justify-center text-xs font-bold">
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
                            <button type="button" className="text-gray-500 hover:text-[#005555]" onClick={() => handleStartEdit(comment)}>
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
                              className="w-full min-h-[100px] rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#005555] focus:border-[#005555]"
                              maxLength={800}
                            />
                            <div className="flex items-center justify-end gap-2">
                              <button type="button" className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-500" onClick={handleCancelEdit}>
                                Cancel
                              </button>
                              <button type="button" className="bg-[#005555] text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest" onClick={() => handleSaveEdit(comment.id)} disabled={!editingContent.trim()}>
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
                  <p className="text-[#005555] text-xs font-bold uppercase tracking-widest mb-3">{displayPost.authorRole}</p>
                ) : (
                  <p className="text-[#005555] text-xs font-bold uppercase tracking-widest mb-3">Editorial Team</p>
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
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-8">You May Also Like</h4>
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
                  <h5 className="font-bold text-gray-900 text-sm leading-snug group-hover:text-[#005555] transition-colors">
                    {relatedPost.title}
                  </h5>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(relatedPost.category ? [relatedPost.category] : relatedPost.tags?.slice(0, 2) || []).slice(0, 2).map((label) => (
                      <span key={label} className="rounded-full bg-gray-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#005555]">
                        {label}
                      </span>
                    ))}
                  </div>
                  <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-wider">{relatedPost.date}</p>
                </Link>
              ))}
            </div>

            <div className="mt-12 bg-[#005555] rounded-3xl p-8 text-white">
              <h4 className="text-lg font-bold mb-4">Want more insights?</h4>
              <p className="text-[#005555] text-xs leading-relaxed mb-6">Join the conversation, ask questions, and get practical guidance from our property team.</p>
              <Link href="/contact" className="block w-full bg-white text-[#005555] py-3 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg text-center">
                Talk to Our Team
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
