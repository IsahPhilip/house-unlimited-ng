import type { Metadata } from "next";
import { PropertyPreviewCard } from "@/components/property-preview-card";
import { getPropertiesByType, getSiteSettings } from "@/lib/wordpress";
import { JsonLd } from "@/lib/json-ld";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Off-Plan Properties in Abuja | House Unlimited Nigeria",
    description:
      "Browse off-plan properties available through House Unlimited Nigeria. Invest early in new developments across Abuja with verified listings and detailed project information.",
    openGraph: {
      title: "Off-Plan Properties in Abuja | House Unlimited Nigeria",
      description:
        "Invest early in new developments across Abuja. Browse verified off-plan property listings at House Unlimited Nigeria.",
    },
  };
}

export default async function OffPlanPropertiesPage() {
  const settings = await getSiteSettings();
  const properties = await getPropertiesByType("off-plan", 24);

  const breadcrumbListSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: settings.siteUrl },
      { "@type": "ListItem", position: 2, name: "Off-Plan Properties", item: settings.siteUrl + "/off-plan-properties" },
    ],
  };

  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Off-Plan Properties | House Unlimited Nigeria",
    description: "Browse off-plan properties available through House Unlimited Nigeria.",
    url: settings.siteUrl + "/off-plan-properties",
    isPartOf: { "@type": "WebSite", name: settings.title, url: settings.siteUrl },
  };

  return (
    <>
      <JsonLd data={breadcrumbListSchema} id="off-plan-breadcrumb-jsonld" />
      <JsonLd data={collectionPageSchema} id="off-plan-collection-jsonld" />
      <div className="py-16 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-12">
            <p className="text-[#005555] font-semibold mb-2 uppercase tracking-widest text-xs">Off-Plan</p>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Off-Plan <span className="text-gray-400 italic font-light">Properties</span>
            </h1>
            <p className="text-gray-500 text-sm max-w-xl">
              Invest early in new developments across Abuja. Secure your unit before completion at pre-launch prices.
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
              <div className="text-6xl mb-6">🏗️</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No off-plan listings right now</h3>
              <p className="text-gray-500 mb-8">Check back soon or browse all our available properties.</p>
              <a href="/properties" className="text-[#005555] font-bold hover:underline">Browse all properties</a>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
