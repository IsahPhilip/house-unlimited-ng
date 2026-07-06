import type { Metadata } from "next";
import { PropertyPreviewCard } from "@/components/property-preview-card";
import { getPropertiesByType, getSiteSettings } from "@/lib/wordpress";
import { JsonLd } from "@/lib/json-ld";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Completed Properties in Abuja | House Unlimited Nigeria",
    description:
      "Browse completed, move-in ready properties in Abuja. Find verified homes and investment properties available now through House Unlimited Nigeria.",
    openGraph: {
      title: "Completed Properties in Abuja | House Unlimited Nigeria",
      description:
        "Move-in ready homes and investment properties in Abuja. Browse verified completed listings at House Unlimited Nigeria.",
    },
  };
}

export default async function CompletedPropertiesPage() {
  const settings = await getSiteSettings();
  const properties = await getPropertiesByType("completed", 24);

  const breadcrumbListSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: settings.siteUrl },
      { "@type": "ListItem", position: 2, name: "Completed Properties", item: settings.siteUrl + "/completed-properties" },
    ],
  };

  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Completed Properties | House Unlimited Nigeria",
    description: "Browse completed, move-in ready properties in Abuja.",
    url: settings.siteUrl + "/completed-properties",
    isPartOf: { "@type": "WebSite", name: settings.title, url: settings.siteUrl },
  };

  return (
    <>
      <JsonLd data={breadcrumbListSchema} id="completed-breadcrumb-jsonld" />
      <JsonLd data={collectionPageSchema} id="completed-collection-jsonld" />
      <div className="py-16 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-12">
            <p className="text-[#005555] font-semibold mb-2 uppercase tracking-widest text-xs">Ready to Move</p>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Completed <span className="text-gray-400 italic font-light">Properties</span>
            </h1>
            <p className="text-gray-500 text-sm max-w-xl">
              Move-in ready homes and investment properties across Abuja. Verified listings with photos, prices, and full details.
            </p>
          </div>

          <div className="flex items-center justify-between mb-8">
            <span className="text-sm font-medium text-gray-500">{properties.length} listing{properties.length !== 1 ? "s" : ""} found</span>
          </div>

          {properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {properties.map((property) => (
                <PropertyPreviewCard key={property.slug} property={property} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-20 text-center border border-dashed border-gray-200">
              <div className="text-6xl mb-6">🏠</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No completed listings right now</h3>
              <p className="text-gray-500 mb-8">Check back soon or browse all our available properties.</p>
              <a href="/properties" className="text-[#005555] font-bold hover:underline">Browse all properties</a>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
