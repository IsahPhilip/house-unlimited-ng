import React from 'react';
import { Page } from '../types';
import { BLOGS } from '../utils/mockData';

const BlogPage = ({ onNavigate }: { onNavigate: (p: Page, id?: number) => void }) => (
  <div className="py-24 bg-gray-50 min-h-screen animate-in fade-in duration-500">
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-16">
        <p className="text-blue-600 font-semibold mb-2 uppercase tracking-widest text-xs font-bold">Latest Updates</p>
        <h1 className="text-4xl font-bold text-gray-900">Industry Insights & <span className="text-gray-400 font-light italic">News</span></h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {BLOGS.map((blog, idx) => (
          <div key={idx} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 group hover:shadow-xl transition-all cursor-pointer" onClick={() => onNavigate('blog-details', blog.id)}>
            <div className="relative aspect-video overflow-hidden">
              <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute top-4 left-4 bg-blue-600 text-white px-4 py-1.5 rounded-full text-[10px] font-bold shadow-md">{blog.date}</div>
            </div>
            <div className="p-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-blue-600 font-bold text-xs uppercase tracking-wider">{blog.category}</span>
                <span className="text-gray-400 text-[10px] font-medium uppercase">{blog.readTime}</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">{blog.title}</h3>
              <p className="text-gray-500 text-xs mb-6 line-clamp-3 leading-relaxed">{blog.desc}</p>
              <button className="text-gray-900 font-bold text-sm flex items-center group-hover:translate-x-1 transition-transform">Read More <span className="ml-2 text-blue-600">→</span></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default BlogPage;