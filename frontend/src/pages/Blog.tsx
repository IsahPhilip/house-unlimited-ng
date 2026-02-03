import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Page, BlogArticle } from '../types';
import { getBlogPosts, getBlogPostsByCategory } from '../services/blogApi';

const BlogPage = ({ onNavigate }: { onNavigate: (p: Page, id?: string) => void }) => {
  const [blogs, setBlogs] = useState<BlogArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 9;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setIsLoading(true);
        let blogData;
        if (selectedCategory === 'all') {
          const response = await getBlogPosts(currentPage, limit);
          blogData = response.posts;
          setTotalPages(response.pagination.totalPages);
        } else {
          blogData = await getBlogPostsByCategory(selectedCategory);
          setTotalPages(1);
        }
        setBlogs(blogData);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, [selectedCategory, currentPage]);

  const categories = ['all', 'Real Estate', 'Market Trends', 'Home Buying', 'Home Selling', 'Investment', 'Property Management', 'Architecture', 'Interior Design', 'Finance', 'Lifestyle'];

  if (isLoading) {
    return (
      <div className="py-24 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-teal-600 font-semibold mb-2 uppercase tracking-widest text-xs font-bold">Latest Updates</p>
            <h1 className="text-4xl font-bold text-gray-900">Industry Insights & <span className="text-gray-400 font-light italic">News</span></h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[...Array(3)].map((_, idx) => (
              <div key={idx} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
                <div className="aspect-video bg-gray-300"></div>
                <div className="p-8 space-y-4">
                  <div className="h-3 bg-gray-300 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-300 rounded w-full"></div>
                  <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                  <div className="h-6 bg-gray-300 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-24 bg-gray-50 min-h-screen animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-teal-600 font-semibold mb-2 uppercase tracking-widest text-xs font-bold">Latest Updates</p>
          <h1 className="text-4xl font-bold text-gray-900">Industry Insights & <span className="text-gray-400 font-light italic">News</span></h1>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(category);
                setCurrentPage(1);
              }}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-teal-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {category === 'all' ? 'All Categories' : category}
            </button>
          ))}
        </div>
        {blogs.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No blog posts available at the moment.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {blogs.map((blog) => (
                <div key={blog.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 group hover:shadow-xl transition-all cursor-pointer" onClick={() => onNavigate('blog-details', blog.id)}>
                  <div className="relative aspect-video overflow-hidden">
                    {blog.image ? (
                      <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs uppercase tracking-widest">
                        No Image
                      </div>
                    )}
                    <div className="absolute top-4 left-4 bg-teal-600 text-white px-4 py-1.5 rounded-full text-[10px] font-bold shadow-md">{blog.date}</div>
                  </div>
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-teal-600 font-bold text-xs uppercase tracking-wider">{blog.category}</span>
                      <span className="text-gray-400 text-[10px] font-medium uppercase">{blog.readTime}</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 group-hover:text-teal-600 transition-colors line-clamp-2 leading-snug">{blog.title}</h3>
                    <p className="text-gray-500 text-xs mb-6 line-clamp-3 leading-relaxed">{blog.desc}</p>
                    <button className="text-gray-900 font-bold text-sm flex items-center group-hover:translate-x-1 transition-transform">
                      Read More <ArrowRight className="ml-2 w-4 h-4 text-teal-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {selectedCategory === 'all' && totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                <button
                  className="px-4 py-2 rounded-full text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
                  <button
                    key={page}
                    className={`w-10 h-10 rounded-full text-sm font-semibold border ${
                      currentPage === page
                        ? 'bg-teal-600 text-white border-teal-600'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
                <button
                  className="px-4 py-2 rounded-full text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
