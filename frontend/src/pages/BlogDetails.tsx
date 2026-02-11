import React, { useState, useEffect } from 'react';
import { Bookmark, Facebook, Heart, Link2, Linkedin, MessageCircle, Pencil, Trash2, Twitter } from 'lucide-react';
import DOMPurify from 'dompurify';
import { Page, BlogArticle, BlogComment } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { addBlogComment, bookmarkBlogPost, deleteBlogComment, getBlogComments, getBlogInteraction, getBlogPostById, getRelatedBlogPosts, incrementBlogViews, likeBlogPost, unlikeBlogPost, unbookmarkBlogPost, updateBlogComment } from '../services/blogApi';
import { handleShare } from '../utils/helpers';

const BlogDetailsPage = ({ blogId, onNavigate, openAuthModal }: { blogId: string, onNavigate: (p: Page, id?: string) => void, openAuthModal?: (mode: 'signin' | 'signup') => void }) => {
  const [blog, setBlog] = useState<BlogArticle | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<BlogArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [views, setViews] = useState(0);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [isCommentsLoading, setIsCommentsLoading] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setIsLoading(true);
        const blogData = await getBlogPostById(blogId);
        setBlog(blogData);
        setViews(blogData.views || 0);
        setLikes(blogData.likes || 0);
        
        // Increment views
        await incrementBlogViews(blogId);
        setViews(prev => prev + 1);

        // Fetch related blogs by category
        const related = await getRelatedBlogPosts(blogId, 3);
        setRelatedBlogs(related);

        // Fetch interaction state if logged in
        if (user) {
          try {
            const interaction = await getBlogInteraction(blogId);
            setLiked(interaction.liked);
            setBookmarked(interaction.bookmarked);
          } catch (error) {
            console.error('Error fetching interaction:', error);
          }
        }
      } catch (error) {
        console.error('Error fetching blog:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlog();
  }, [blogId, user]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setIsCommentsLoading(true);
        const data = await getBlogComments(blogId);
        setComments(data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      } finally {
        setIsCommentsLoading(false);
      }
    };

    fetchComments();
  }, [blogId]);

  const requireAuth = (message: string) => {
    if (!user) {
      if (openAuthModal) {
        openAuthModal('signin');
      } else {
        alert(message);
      }
      return false;
    }
    return true;
  };

  const handleToggleLike = async () => {
    if (!requireAuth('Please sign in to like this post.')) return;

    try {
      if (liked) {
        const response = await unlikeBlogPost(blogId);
        setLiked(response.liked);
        setLikes(response.likes);
      } else {
        const response = await likeBlogPost(blogId);
        setLiked(response.liked);
        setLikes(response.likes);
      }
    } catch (error) {
      console.error('Error updating like:', error);
    }
  };

  const handleToggleBookmark = async () => {
    if (!requireAuth('Please sign in to save this post.')) return;

    try {
      if (bookmarked) {
        const response = await unbookmarkBlogPost(blogId);
        setBookmarked(response.bookmarked);
      } else {
        const response = await bookmarkBlogPost(blogId);
        setBookmarked(response.bookmarked);
      }
    } catch (error) {
      console.error('Error updating bookmark:', error);
    }
  };

  const handleSubmitComment = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!requireAuth('Please sign in to comment.')) return;
    if (!commentText.trim()) return;

    try {
      setCommentSubmitting(true);
      const created = await addBlogComment(blogId, commentText.trim());
      setComments((prev) => [created, ...prev]);
      setCommentText('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setCommentSubmitting(false);
    }
  };

  const handleStartEdit = (comment: BlogComment) => {
    setEditingCommentId(comment.id);
    setEditingContent(comment.content);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingContent('');
  };

  const handleSaveEdit = async (commentId: string) => {
    if (!editingContent.trim()) return;
    try {
      const updated = await updateBlogComment(commentId, editingContent.trim());
      setComments((prev) => prev.map((comment) => (comment.id === commentId ? updated : comment)));
      setEditingCommentId(null);
      setEditingContent('');
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteBlogComment(commentId);
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const currentUserId = user?.id || user?._id || '';

  if (isLoading) {
    return (
      <div className="bg-white min-h-screen animate-in fade-in duration-500">
        <div className="relative h-[400px] md:h-[500px] bg-gray-300 animate-pulse"></div>
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
            <div className="h-12 bg-gray-300 rounded w-3/4 mb-8"></div>
            <div className="space-y-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-300 rounded w-full"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="p-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Article not found</h2>
        <p className="text-gray-500">The blog post you're looking for doesn't exist or may have been moved.</p>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen animate-in fade-in duration-500">
      {/* Article Hero */}
      <div className="relative h-[400px] md:h-[500px]">
        {blog.image ? (
          <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs uppercase tracking-widest">
            No Image
          </div>
        )}
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="max-w-4xl px-4 text-center">
            <span className="bg-teal-600 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 inline-block shadow-lg">
              {blog.category}
            </span>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight drop-shadow-lg">
              {blog.title}
            </h1>
            <div className="mt-8 flex items-center justify-center space-x-4 text-white/90">
              <div className="flex items-center space-x-2">
                {blog.author?.image ? (
                  <img src={blog.author.image} className="w-8 h-8 rounded-full border-2 border-white/20" />
                ) : (
                  <div className="w-8 h-8 rounded-full border-2 border-white/20 bg-white/20 flex items-center justify-center text-[10px] font-bold uppercase">
                    {blog.author?.name?.split(' ').map((part) => part[0]).join('').slice(0, 2) || 'NA'}
                  </div>
                )}
                <span className="font-bold text-sm">{blog.author?.name || 'Unknown Author'}</span>
              </div>
              <span className="text-white/40">•</span>
              <span className="text-sm font-medium">{blog.date}</span>
              <span className="text-white/40">•</span>
              <span className="text-sm font-medium">{blog.readTime}</span>
              <span className="text-white/40">•</span>
              <span className="text-sm font-medium">{views} views</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-4 gap-16">
        {/* Social Share Sidebar */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-32 space-y-8">
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-6">Share Article</h4>
              <div className="flex flex-col space-y-4">
                <button onClick={() => handleShare(blog)} className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-teal-600 hover:text-white transition-all shadow-sm">
                  <Facebook className="w-5 h-5" />
                </button>
                <button onClick={() => handleShare(blog)} className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-teal-400 hover:text-white transition-all shadow-sm">
                  <Twitter className="w-5 h-5" />
                </button>
                <button onClick={() => handleShare(blog)} className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-teal-700 hover:text-white transition-all shadow-sm">
                  <Linkedin className="w-5 h-5" />
                </button>
                <button onClick={() => handleShare(blog)} className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                  <Link2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-2">
          <article className="prose prose-lg prose-slate max-w-none">
            {/<\/?[a-z][\s\S]*>/i.test(blog.content) ? (
              <div
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.content) }}
              />
            ) : (
              blog.content.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="text-gray-600 text-lg leading-relaxed mb-8">
                  {paragraph}
                </p>
              ))
            )}
          </article>

          {/* Likes Section */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button 
              className={`flex items-center space-x-2 transition-colors ${liked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'}`}
              onClick={handleToggleLike}
            >
              <Heart className="w-4 h-4" />
              <span>{likes} Likes</span>
            </button>
            <div className="flex items-center space-x-2 text-gray-600">
              <MessageCircle className="w-4 h-4" />
              <span>{comments.length} Comments</span>
            </div>
            <button
              className={`flex items-center space-x-2 transition-colors ${bookmarked ? 'text-teal-600' : 'text-gray-600 hover:text-teal-600'}`}
              onClick={handleToggleBookmark}
            >
              <Bookmark className="w-4 h-4" />
              <span>{bookmarked ? 'Saved' : 'Save'}</span>
            </button>
          </div>

          {/* Comments Section */}
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Comments</h3>
              {!user && (
                <span className="text-xs text-gray-500">Sign in to join the discussion.</span>
              )}
            </div>

            <form onSubmit={handleSubmitComment} className="mb-8">
              <textarea
                value={commentText}
                onChange={(event) => setCommentText(event.target.value)}
                placeholder={user ? 'Write a thoughtful comment...' : 'Sign in to comment'}
                className="w-full min-h-[120px] rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                disabled={!user || commentSubmitting}
              />
              <div className="mt-3 flex items-center justify-end">
                <button
                  type="submit"
                  className="bg-teal-600 text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm disabled:opacity-60"
                  disabled={!user || commentSubmitting || !commentText.trim()}
                >
                  {commentSubmitting ? 'Posting...' : 'Post Comment'}
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
                            <img src={comment.user.avatar} className="w-10 h-10 rounded-full object-cover" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-bold">
                              {comment.user?.name?.split(' ').map((part) => part[0]).join('').slice(0, 2) || 'NA'}
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-bold text-gray-900">{comment.user?.name || 'Anonymous'}</div>
                            <div className="text-xs text-gray-400">
                              {new Date(comment.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </div>
                          </div>
                        </div>

                        {isOwner && (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              className="text-gray-500 hover:text-teal-600"
                              onClick={() => handleStartEdit(comment)}
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              className="text-gray-500 hover:text-red-500"
                              onClick={() => handleDeleteComment(comment.id)}
                            >
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
                              <button
                                type="button"
                                className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-500"
                                onClick={handleCancelEdit}
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                className="bg-teal-600 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest"
                                onClick={() => handleSaveEdit(comment.id)}
                                disabled={!editingContent.trim()}
                              >
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

          {/* Author Bio */}
          <div className="mt-16 pt-12 border-t border-gray-100">
            <div className="bg-gray-50 p-8 rounded-3xl flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
              {blog.author?.image ? (
                <img src={blog.author.image} className="w-24 h-24 rounded-3xl object-cover shadow-xl" />
              ) : (
                <div className="w-24 h-24 rounded-3xl bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-600">
                  {blog.author?.name?.split(' ').map((part) => part[0]).join('').slice(0, 2) || 'NA'}
                </div>
              )}
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-1">{blog.author?.name || 'Unknown Author'}</h4>
                {blog.author?.role && (
                  <p className="text-teal-600 text-xs font-bold uppercase tracking-widest mb-3">{blog.author.role}</p>
                )}
                {blog.author?.bio && (
                  <p className="text-gray-500 text-sm leading-relaxed italic">
                    {blog.author.bio}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar / Related */}
        <div className="lg:col-span-1">
          <div className="sticky top-32">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-8">Related Articles</h4>
            <div className="space-y-8">
              {relatedBlogs.map(rb => (
                <div key={rb.id} className="group cursor-pointer" onClick={() => onNavigate('blog-details', rb.id)}>
                  <div className="aspect-video rounded-2xl overflow-hidden mb-4 shadow-sm">
                    {rb.image ? (
                      <img src={rb.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-[10px] uppercase tracking-widest">
                        No Image
                      </div>
                    )}
                  </div>
                  <h5 className="font-bold text-gray-900 text-sm leading-snug group-hover:text-teal-600 transition-colors">
                    {rb.title}
                  </h5>
                  <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-wider">{rb.date}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 bg-teal-600 rounded-3xl p-8 text-white">
              <h4 className="text-lg font-bold mb-4">Want more insights?</h4>
              <p className="text-teal-100 text-xs leading-relaxed mb-6">Join 50,000+ home buyers receiving our weekly market reports and design tips.</p>
              <input placeholder="Email address" className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-xs text-white placeholder:text-teal-200 focus:ring-2 focus:ring-white outline-none mb-3" />
              <button className="w-full bg-white text-teal-600 py-3 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg">Subscribe</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailsPage;
