
import type { Metadata } from 'next';
import { JsonLd } from '@/lib/json-ld';
import { OptimizedImage, IMAGE_SIZES } from '@/components/optimized-image';
import { BlogPostClient } from './[slug]/blog-post-client'; // Assuming you might reuse this for display
// Import your authoritative data source. Use require with a fallback to avoid
// TypeScript "Cannot find module '../../metadata.json'" when JSON module
// resolution isn't enabled in the project.
let metadata: any;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  metadata = require('../../metadata.json');
} catch (e) {
  // Minimal fallback to prevent runtime errors if the JSON file can't be resolved
  metadata = {
    url: '',
    name: 'House Unlimited',
    seo: { openGraph: { image: '/og-image.png' } },
  };
}

/*
 * =====================================================================================
 * HOW TO USE THIS TEMPLATE
 * =====================================================================================
 *
 * 1. DUPLICATE THIS FILE:
 *    For each new blog post, duplicate this file and rename it to `[your-post-slug].tsx`
 *    inside a new directory under `/blog`. For example: `/blog/my-first-post/page.tsx`.
 *    (This follows Next.js App Router conventions for a new route).
 *
 * 2. FILL IN THE POST DETAILS:
 *    Update the `postDetails` object below with your new post's content.
 *    - `slug`:       The URL-friendly identifier for your post.
 *    - `title`:      The main headline of your article.
 *    - `excerpt`:    A short summary (1-2 sentences) for search results and previews.
 *    - `authorName`: The name of the person who wrote the post.
 *    - `date`:       The publication date in YYYY-MM-DD format.
 *    - `featuredImage`: The main image for the post (URL).
 *    - `content`:    The full article content, written in HTML or JSX.
 *
 * 3. CUSTOMIZE METADATA (Optional):
 *    The `generateMetadata` function automatically creates a title and description.
 *    You can customize the `openGraph` images if needed.
 *
 * 4. PUBLISH:
 *    Once you've filled everything in, your new blog post is ready to be published!
 *
 * =====================================================================================
 */

// STEP 2: Fill in your post details here
const postDetails = {
  slug: 'your-new-post-slug',
  title: 'Your Awesome Blog Post Title',
  excerpt: 'A brief and catchy summary of your blog post goes here. This is great for SEO!',
  authorName: 'Firstname Lastname', // Or "House Unlimited Nigeria Team"
  date: '2026-07-26', // Use format YYYY-MM-DD
  featuredImage: '/path/to/your/featured-image.jpg',
  content: (
    <>
      <p>This is the introduction to your blog post. Start with a hook to grab the reader's attention.</p>
      <h2>Section 1: The First Main Point</h2>
      <p>Elaborate on your first main point here. Provide details, examples, and valuable insights.</p>
      <h2>Section 2: The Second Main Point</h2>
      <p>Discuss the second key aspect of your topic. You can include lists, images, or quotes.</p>
      <ul>
        <li>First list item</li>
        <li>Second list item</li>
      </ul>
      <h2>Conclusion</h2>
      <p>Summarize the key takeaways from your post and provide a concluding thought or a call-to-action.</p>
    </>
  ),
};

// --- Helper function to count words ---
const countWords = (content: React.ReactNode): number => {
  if (typeof content === 'string') {
    return content.trim().split(/\s+/).length;
  }
  if (Array.isArray(content)) {
    return content.reduce((acc, child) => acc + countWords(child), 0);
  }
  if (content && typeof content === 'object' && 'props' in content) {
    return countWords(content.props.children);
  }
  return 0;
};

const wordCount = countWords(postDetails.content);
const articleBodyText = (function getText(node: React.ReactNode): string {
    if (typeof node === 'string') return node;
    if (Array.isArray(node)) return node.map(getText).join('');
    if (node && typeof node === 'object' && 'props' in node) {
        return getText(node.props.children);
    }
    return '';
})(postDetails.content);


// STEP 3: Customize Metadata (Optional)
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: postDetails.title,
    description: postDetails.excerpt,
    openGraph: {
      title: postDetails.title,
      description: postDetails.excerpt,
      images: postDetails.featuredImage ? [postDetails.featuredImage] : [],
    },
  };
}

// --- AI SEO Schema ---
const blogPostingSchema = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  'headline': postDetails.title,
  'description': postDetails.excerpt,
  'url': `${metadata.url}/blog/${postDetails.slug}`,
  'datePublished': postDetails.date,
  'dateModified': postDetails.date, // Update if you modify the post later
  'author': {
    '@type': 'Person',
    'name': postDetails.authorName,
  },
  'publisher': {
    '@type': 'Organization',
    '@id': `${metadata.url}#organization`, // Link to your main Organization schema
    'name': metadata.name,
    'logo': {
      '@type': 'ImageObject',
      'url': `${metadata.url}${metadata.seo.openGraph.image}`,
    },
  },
  'image': `${metadata.url}${postDetails.featuredImage}`,
  'mainEntityOfPage': {
    '@type': 'WebPage',
    '@id': `${metadata.url}/blog/${postDetails.slug}`,
  },
  'articleBody': articleBodyText,
  'wordCount': wordCount,
};

// --- Blog Post Page Component ---
export default function BlogPostTemplatePage() {
  // This is a simplified display. You can reuse and adapt your `BlogPostClient`
  // or create a new layout for these statically-generated posts.
  return (
    <>
      <JsonLd data={blogPostingSchema} id="blog-post-schema" />
      <div className="bg-white py-24 animate-in fade-in duration-500">
        <div className="max-w-3xl mx-auto px-4">
          <article>
            <header className="mb-8">
              <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{postDetails.title}</h1>
              <p className="text-sm text-gray-500">
                By {postDetails.authorName} on {new Date(postDetails.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              {postDetails.featuredImage && (
                <div className="relative w-full h-96 mt-4 rounded-2xl overflow-hidden">
                    <OptimizedImage
                        src={postDetails.featuredImage}
                        alt={postDetails.title}
                        sizes={IMAGE_SIZES.hero}
                        className="object-cover"
                        priority
                    />
                </div>
              )}
            </header>
            <div className="prose prose-lg max-w-none">
              {postDetails.content}
            </div>
          </article>
        </div>
      </div>
    </>
  );
}
