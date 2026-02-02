import React from 'react';
import { Page } from '../types';
import { BLOGS } from '../utils/mockData';
import { handleShare } from '../utils/helpers';

const BlogDetailsPage = ({ blogId, onNavigate }: { blogId: number, onNavigate: (p: Page, id?: number) => void }) => {
  const blog = BLOGS.find(b => b.id === blogId);
  if (!blog) return <div className="p-20 text-center">Article not found.</div>;

  const relatedBlogs = BLOGS.filter(b => b.id !== blogId).slice(0, 3);

  return (
    <div className="bg-white min-h-screen animate-in fade-in duration-500">
      {/* Article Hero */}
      <div className="relative h-[400px] md:h-[500px]">
        <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
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
                <img src={blog.author.image} className="w-8 h-8 rounded-full border-2 border-white/20" />
                <span className="font-bold text-sm">{blog.author.name}</span>
              </div>
              <span className="text-white/40">•</span>
              <span className="text-sm font-medium">{blog.date}</span>
              <span className="text-white/40">•</span>
              <span className="text-sm font-medium">{blog.readTime}</span>
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

          {/* Author Bio */}
          <div className="mt-16 pt-12 border-t border-gray-100">
            <div className="bg-gray-50 p-8 rounded-3xl flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
              <img src={blog.author.image} className="w-24 h-24 rounded-3xl object-cover shadow-xl" />
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-1">{blog.author.name}</h4>
                <p className="text-teal-600 text-xs font-bold uppercase tracking-widest mb-3">{blog.author.role}</p>
                <p className="text-gray-500 text-sm leading-relaxed italic">
                  Passionate about connecting people with their ideal living spaces. Sarah has over 15 years of experience in the luxury real estate sector.
                </p>
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
                    <img src={rb.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
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