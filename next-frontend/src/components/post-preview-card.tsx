import Link from "next/link";
import type { PostPreview } from "@/lib/wordpress";

export function PostPreviewCard({ post }: { post: PostPreview }) {
  return (
    <Link href={`/blog/${post.slug}`} className="block">
      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 group hover:shadow-xl transition-all">
        <div className="relative aspect-video overflow-hidden">
          {post.featuredImage ? (
            <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs uppercase tracking-widest">
              No Image
            </div>
          )}
          <div className="absolute top-4 left-4 bg-[#005555] text-white px-4 py-1.5 rounded-full text-[10px] font-bold shadow-md">{post.date}</div>
        </div>
        <div className="p-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#005555] font-bold text-xs uppercase tracking-wider">{post.categories.join(", ") || "Blog"}</span>
            <span className="text-gray-400 text-[10px] font-medium uppercase">5 min read</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-4 group-hover:text-[#005555] transition-colors line-clamp-2 leading-snug">{post.title}</h3>
          <p className="text-gray-500 text-xs mb-6 line-clamp-3 leading-relaxed">{post.excerpt}</p>
          <div className="text-gray-900 font-bold text-sm flex items-center group-hover:translate-x-1 transition-transform">
            Read More
            <svg className="ml-2 w-4 h-4 text-[#005555]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
