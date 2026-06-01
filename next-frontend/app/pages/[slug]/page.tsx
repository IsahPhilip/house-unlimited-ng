import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPageBySlug, getPageSlugs, getSiteSettings } from "@/lib/wordpress";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getPageSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
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
  const page = await getPageBySlug(slug);

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