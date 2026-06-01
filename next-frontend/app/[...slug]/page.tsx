import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPageBySlug, getPageSlugs, getSiteSettings } from "@/lib/wordpress";

// Routes that should NOT be handled by this dynamic page
const EXCLUDED_ROUTES = [
  "blog",
  "properties",
  "careers",
  "contact",
  "about",
  "privacy",
  "terms",
  "api",
  "pages",
];

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

export async function generateStaticParams() {
  const slugs = await getPageSlugs();
  // Only generate params for pages that aren't excluded
  return slugs
    .filter((slug) => !EXCLUDED_ROUTES.includes(slug))
    .map((slug) => ({ slug: [slug] }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const pageSlug = slug[0];
  
  // If this is an excluded route, don't generate metadata
  if (EXCLUDED_ROUTES.includes(pageSlug)) {
    return {};
  }
  
  const page = await getPageBySlug(pageSlug);
  const settings = await getSiteSettings();

  if (!page) {
    return {
      title: "Page Not Found",
      description: "The requested page could not be found.",
    };
  }

  return {
    title: `${page.title} | ${settings.title}`,
    description: page.excerpt,
    openGraph: {
      title: `${page.title} | ${settings.title}`,
      description: page.excerpt,
    },
  };
}

export default async function WordPressPage({ params }: PageProps) {
  const { slug } = await params;
  const pageSlug = slug[0];

  // If this is an excluded route, show 404 to let Next.js handle other routes
  if (EXCLUDED_ROUTES.includes(pageSlug)) {
    notFound();
  }

  const page = await getPageBySlug(pageSlug);

  if (!page) {
    notFound();
  }

  return (
    <div className="animate-in fade-in duration-500">
      {/* Hero Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {page.title}
          </h1>
          {page.excerpt && (
            <p className="text-xl text-gray-600 mb-8">{page.excerpt}</p>
          )}
          {page.featuredImage && (
            <div className="relative h-64 md:h-96 w-full overflow-hidden rounded-3xl shadow-xl mb-8">
              <img
                src={page.featuredImage.sourceUrl}
                alt={page.featuredImage.altText || page.title}
                className="object-cover w-full h-full"
              />
            </div>
          )}
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div
            className="prose prose-lg prose-teal max-w-none"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </div>
      </section>

      {/* Updated Date */}
      {page.modified && (
        <section className="py-8 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4">
            <p className="text-sm text-gray-500">
              Last updated: {page.modified}
            </p>
          </div>
        </section>
      )}
    </div>
  );
}