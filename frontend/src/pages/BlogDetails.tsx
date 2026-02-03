import React, { useState, useEffect } from 'react';
import { Page, BlogArticle } from '../types';
import { getBlogPostById, getRelatedBlogPosts, incrementBlogViews, incrementBlogLikes } from '../services/blogApi';
import { handleShare } from '../utils/helpers';

const BlogDetailsPage = ({ blogId, onNavigate }: { blogId: string, onNavigate: (p: Page, id?: string) => void }) => {
  const [blog, setBlog] = useState<BlogArticle | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<BlogArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [views, setViews] = useState(0);
  const [likes, setLikes] = useState(0);

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
      } catch (error) {
        console.error('Error fetching blog:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlog();
  }, [blogId]);

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
                  <i className="fab fa-facebook-f"></i>
                </button>
                <button onClick={() => handleShare(blog)} className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-teal-400 hover:text-white transition-all shadow-sm">
                  <i className="fab fa-twitter"></i>
                </button>
                <button onClick={() => handleShare(blog)} className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-teal-700 hover:text-white transition-all shadow-sm">
                  <i className="fab fa-linkedin-in"></i>
                </button>
                <button onClick={() => handleShare(blog)} className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                  <i className="fas fa-link"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-2">
          <article className="prose prose-lg prose-slate max-w-none">
            {blog.content.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="text-gray-600 text-lg leading-relaxed mb-8">
                {paragraph}
              </p>
            ))}
          </article>

          {/* Likes Section */}
          <div className="mt-8 flex items-center space-x-4">
            <button 
              className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors"
              onClick={async () => {
                const newLikes = await incrementBlogLikes(blogId);
                setLikes(newLikes);
              }}
            >
              <i className="fas fa-heart"></i>
              <span>{likes} Likes</span>
            </button>
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
