import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getBlogPosts, deleteBlogPost, publishBlogPost, unpublishBlogPost, archiveBlogPost, unarchiveBlogPost, getBlogComments, deleteBlogComment, updateBlogCommentStatus, bulkModerateBlogComments, updateUser } from '../services/api';
import { BlogPost, BlogComment } from '../types/admin';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Calendar, 
  User, 
  Tag,
  FileText,
  Clock,
  EyeIcon,
  Archive,
  RotateCcw,
  MessageSquare,
  RefreshCw
} from 'lucide-react';

export default function Blog() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'archived'>('all');
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentsError, setCommentsError] = useState('');
  const [commentSearch, setCommentSearch] = useState('');
  const [commentsPage, setCommentsPage] = useState(1);
  const [commentsTotalPages, setCommentsTotalPages] = useState(1);
  const [selectedComments, setSelectedComments] = useState<string[]>([]);
  const [bulkLoading, setBulkLoading] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  useEffect(() => {
    fetchComments();
  }, [commentsPage, commentSearch]);

  const fetchBlogPosts = async () => {
    try {
      setIsLoading(true);
      const response = await getBlogPosts();
      setBlogPosts(response);
    } catch (err) {
      setError('Failed to fetch blog posts');
      console.error('Error fetching blog posts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      setCommentsLoading(true);
      setCommentsError('');
      const response = await getBlogComments({ page: commentsPage, limit: 10, q: commentSearch });
      setComments(response.comments);
      setSelectedComments([]);
      setCommentsTotalPages(response.pagination.totalPages);
    } catch (err) {
      setCommentsError('Failed to fetch comments');
      console.error('Error fetching comments:', err);
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await deleteBlogPost(id);
        setBlogPosts(blogPosts.filter(post => post.id !== id));
      } catch (err) {
        setError('Failed to delete blog post');
        console.error('Error deleting blog post:', err);
      }
    }
  };

  const handlePublish = async (id: string) => {
    try {
      const updatedPost = await publishBlogPost(id);
      setBlogPosts(blogPosts.map(post => post.id === id ? updatedPost : post));
    } catch (err) {
      setError('Failed to publish blog post');
      console.error('Error publishing blog post:', err);
    }
  };

  const handleUnpublish = async (id: string) => {
    try {
      const updatedPost = await unpublishBlogPost(id);
      setBlogPosts(blogPosts.map(post => post.id === id ? updatedPost : post));
    } catch (err) {
      setError('Failed to unpublish blog post');
      console.error('Error unpublishing blog post:', err);
    }
  };

  const handleArchive = async (id: string) => {
    try {
      const updatedPost = await archiveBlogPost(id);
      setBlogPosts(blogPosts.map(post => post.id === id ? updatedPost : post));
    } catch (err) {
      setError('Failed to archive blog post');
      console.error('Error archiving blog post:', err);
    }
  };

  const handleUnarchive = async (id: string) => {
    try {
      const updatedPost = await unarchiveBlogPost(id);
      setBlogPosts(blogPosts.map(post => post.id === id ? updatedPost : post));
    } catch (err) {
      setError('Failed to unarchive blog post');
      console.error('Error unarchiving blog post:', err);
    }
  };

  const handleDeleteComment = async (id: string) => {
    if (!window.confirm('Remove this comment?')) return;
    try {
      await deleteBlogComment(id);
      setComments((prev) => prev.filter((comment) => comment.id !== id));
    } catch (err) {
      setCommentsError('Failed to delete comment');
      console.error('Error deleting comment:', err);
    }
  };

  const handleToggleCommentStatus = async (comment: BlogComment) => {
    try {
      const newStatus = comment.status === 'hidden' ? 'visible' : 'hidden';
      await updateBlogCommentStatus(comment.id, newStatus);
      setComments((prev) => prev.map((item) => (item.id === comment.id ? { ...item, status: newStatus } : item)));
    } catch (err) {
      setCommentsError('Failed to update comment status');
      console.error('Error updating comment status:', err);
    }
  };

  const handleBulkAction = async (action: 'delete' | 'hide' | 'unhide') => {
    if (selectedComments.length === 0) return;
    if (action === 'delete' && !window.confirm('Remove selected comments?')) return;
    try {
      setBulkLoading(true);
      await bulkModerateBlogComments(action, selectedComments);
      await fetchComments();
    } catch (err) {
      setCommentsError('Failed to apply bulk action');
      console.error('Bulk action error:', err);
    } finally {
      setBulkLoading(false);
    }
  };

  const handleBanUsers = async () => {
    const targets = comments
      .filter((comment) => selectedComments.includes(comment.id))
      .map((comment) => comment.user?.id)
      .filter((id): id is string => !!id);

    const uniqueTargets = Array.from(new Set(targets));
    if (uniqueTargets.length === 0) return;

    if (!window.confirm(`Ban ${uniqueTargets.length} user(s)? They will be deactivated.`)) return;

    try {
      setBulkLoading(true);
      await Promise.all(uniqueTargets.map((id) => updateUser(id, { isActive: false })));
      await fetchComments();
    } catch (err) {
      setCommentsError('Failed to ban users');
      console.error('Ban users error:', err);
    } finally {
      setBulkLoading(false);
    }
  };

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
            <div className="grid gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow p-6">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-300 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Blog Management</h1>
              <p className="mt-1 text-sm text-gray-600">
                Manage your blog posts, articles, and content
              </p>
            </div>
            <button
              onClick={() => navigate('/blog/create')}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Create Post</span>
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FileText className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search blog posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-input pl-10"
                  />
                </div>
              </div>
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="form-input"
                >
                  <option value="all">All Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Blog Posts Grid */}
        <div className="grid gap-6">
          {filteredPosts.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No blog posts found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Create your first blog post to get started.'}
              </p>
              {!(searchTerm || statusFilter !== 'all') && (
                <button
                  onClick={() => navigate('/blog/create')}
                  className="btn-primary"
                >
                  Create Your First Post
                </button>
              )}
            </div>
          ) : (
            filteredPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(post.status)}`}>
                          {post.status.toUpperCase()}
                        </span>
                        <span className="text-sm text-gray-500">{post.category}</span>
                      </div>
                      
                      <h2 className="text-xl font-semibold text-gray-900 mb-2 hover:text-primary-600 cursor-pointer">
                        {post.title}
                      </h2>
                      
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{post.author.name}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{post.readTime} min read</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <EyeIcon className="h-4 w-4" />
                          <span>{post.views} views</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 mt-4">
                        {post.tags.map((tag) => (
                          <span key={tag} className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="ml-6 flex flex-col space-y-2">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => navigate(`/blog/edit/${post.id}`)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Edit"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                      
                      <div className="flex space-x-2">
                        {post.status === 'published' ? (
                          <>
                            <button
                              onClick={() => handleUnpublish(post.id)}
                              className="p-2 text-gray-400 hover:text-yellow-600 transition-colors"
                              title="Unpublish"
                            >
                              <EyeOff className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleArchive(post.id)}
                              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                              title="Archive"
                            >
                              <Archive className="h-5 w-5" />
                            </button>
                          </>
                        ) : post.status === 'draft' ? (
                          <>
                            <button
                              onClick={() => handlePublish(post.id)}
                              className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                              title="Publish"
                            >
                              <Eye className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleArchive(post.id)}
                              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                              title="Archive"
                            >
                              <Archive className="h-5 w-5" />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleUnarchive(post.id)}
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Unarchive"
                          >
                            <RotateCcw className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Comment Moderation */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Comment Moderation</h2>
              <p className="text-sm text-gray-600">Review and remove user comments.</p>
            </div>
            <button
              onClick={() => fetchComments()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>

          <div className="bg-white rounded-lg shadow mb-6">
            <div className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="relative max-w-md flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MessageSquare className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search comments..."
                    value={commentSearch}
                    onChange={(e) => { setCommentSearch(e.target.value); setCommentsPage(1); }}
                    className="form-input pl-10"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleBulkAction('hide')}
                    className="px-3 py-2 text-xs font-semibold uppercase tracking-wide border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                    disabled={bulkLoading || selectedComments.length === 0}
                  >
                    Hide Selected
                  </button>
                  <button
                    onClick={() => handleBulkAction('unhide')}
                    className="px-3 py-2 text-xs font-semibold uppercase tracking-wide border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                    disabled={bulkLoading || selectedComments.length === 0}
                  >
                    Unhide Selected
                  </button>
                  <button
                    onClick={() => handleBulkAction('delete')}
                    className="px-3 py-2 text-xs font-semibold uppercase tracking-wide border border-red-200 rounded-lg text-red-600 hover:bg-red-50 disabled:opacity-50"
                    disabled={bulkLoading || selectedComments.length === 0}
                  >
                    Delete Selected
                  </button>
                  <button
                    onClick={handleBanUsers}
                    className="px-3 py-2 text-xs font-semibold uppercase tracking-wide border border-yellow-200 rounded-lg text-yellow-700 hover:bg-yellow-50 disabled:opacity-50"
                    disabled={bulkLoading || selectedComments.length === 0}
                  >
                    Ban User
                  </button>
                </div>
              </div>
            </div>
          </div>

          {commentsError && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6">
              {commentsError}
            </div>
          )}

          {commentsLoading ? (
            <div className="bg-white rounded-lg shadow p-6 animate-pulse space-y-4">
              {[...Array(4)].map((_, idx) => (
                <div key={idx} className="h-16 bg-gray-100 rounded-lg"></div>
              ))}
            </div>
          ) : comments.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <MessageSquare className="h-10 w-10 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No comments found.</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow divide-y">
              {comments.map((comment) => (
                <div key={comment.id} className="p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-2">
                      <input
                        type="checkbox"
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        checked={selectedComments.includes(comment.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedComments((prev) => [...prev, comment.id]);
                          } else {
                            setSelectedComments((prev) => prev.filter((id) => id !== comment.id));
                          }
                        }}
                      />
                      {comment.user?.avatar ? (
                        <img src={comment.user.avatar} className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs font-bold">
                          {comment.user?.name?.split(' ').map((p) => p[0]).join('').slice(0, 2) || 'NA'}
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{comment.user?.name || 'Anonymous'}</div>
                        <div className="text-xs text-gray-400">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <span className={`ml-2 px-2 py-0.5 text-[10px] uppercase tracking-wide rounded-full ${comment.status === 'hidden' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                        {comment.status === 'hidden' ? 'Hidden' : 'Visible'}
                      </span>
                      {comment.user && comment.user.isActive === false && (
                        <span className="px-2 py-0.5 text-[10px] uppercase tracking-wide rounded-full bg-red-100 text-red-700">
                          Banned
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{comment.content}</p>
                    <div className="text-xs text-gray-500">
                      Post: <span className="font-semibold text-gray-700">{comment.post?.title || 'Unknown Post'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => comment.post?.id && navigate(`/blog/edit/${comment.post.id}`)}
                      className="px-3 py-2 text-sm font-semibold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
                      disabled={!comment.post?.id}
                    >
                      View Post
                    </button>
                    <button
                      onClick={() => handleToggleCommentStatus(comment)}
                      className="px-3 py-2 text-sm font-semibold text-blue-600 border border-blue-100 rounded-lg hover:bg-blue-50"
                    >
                      {comment.status === 'hidden' ? 'Unhide' : 'Hide'}
                    </button>
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="px-3 py-2 text-sm font-semibold text-red-600 border border-red-200 rounded-lg hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {commentsTotalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                className="px-4 py-2 rounded-full text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                onClick={() => setCommentsPage((prev) => Math.max(1, prev - 1))}
                disabled={commentsPage === 1}
              >
                Previous
              </button>
              {Array.from({ length: commentsTotalPages }, (_, idx) => idx + 1).map((page) => (
                <button
                  key={page}
                  className={`w-10 h-10 rounded-full text-sm font-semibold border ${
                    commentsPage === page
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-100'
                  }`}
                  onClick={() => setCommentsPage(page)}
                >
                  {page}
                </button>
              ))}
              <button
                className="px-4 py-2 rounded-full text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                onClick={() => setCommentsPage((prev) => Math.min(commentsTotalPages, prev + 1))}
                disabled={commentsPage === commentsTotalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
