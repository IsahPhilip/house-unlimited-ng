import type { Metadata } from "next";
import { PostPreviewCard } from "@/components/post-preview-card";
import { getRecentPosts, getSiteSettings } from "@/lib/wordpress";
import { ArrowRight } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    title: "Blog",
    description: `Insights, property news, and editorial updates from ${settings.title}.`
  };
}

export default async function BlogIndexPage() {
  const posts = await getRecentPosts(12);

  const categories = [
    'all',
    'Abuja Markets',
    'Off-Plan Development',
    'Land Acquisition',
    'Investment Guide',
    'Property Management',
    'Architecture & Design',
    'Finance & Mortgages',
    'Lifestyle',
    'Market Trends',
    'Diaspora Investment',
  ];

  return (
    <div className="py-24 bg-gray-50 min-h-screen">
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
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                category === 'all'
                  ? 'bg-teal-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {category === 'all' ? 'All Categories' : category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.slug} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 group hover:shadow-xl transition-all cursor-pointer">
                <div className="relative aspect-video overflow-hidden">
                  {post.featuredImage ? (
                    <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs uppercase tracking-widest">
                      No Image
                    </div>
                  )}
                  <div className="absolute top-4 left-4 bg-teal-600 text-white px-4 py-1.5 rounded-full text-[10px] font-bold shadow-md">{post.date}</div>
                </div>
                <div className="p-8">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-teal-600 font-bold text-xs uppercase tracking-wider">{post.categories.join(", ") || "Blog"}</span>
                    <span className="text-gray-400 text-[10px] font-medium uppercase">5 min read</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 group-hover:text-teal-600 transition-colors line-clamp-2 leading-snug">{post.title}</h3>
                  <p className="text-gray-500 text-xs mb-6 line-clamp-3 leading-relaxed">{post.excerpt}</p>
                  <a href={`/blog/${post.slug}`} className="text-gray-900 font-bold text-sm flex items-center group-hover:translate-x-1 transition-transform">
                    Read More <ArrowRight className="ml-2 w-4 h-4 text-teal-600" />
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <p className="text-gray-500 text-lg">No blog posts available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
