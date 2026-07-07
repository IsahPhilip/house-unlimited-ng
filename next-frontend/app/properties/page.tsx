import type { Metadata } from "next";
import { getFeaturedProperties, getSiteSettings } from "@/lib/wordpress";
import { JsonLd } from "@/lib/json-ld";
import { PropertiesClient } from "./properties-client";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    title: "Properties for Sale in Abuja | Verified Real Estate Listings",
    description: `Browse verified properties for sale in Abuja. Find luxury homes, land, and investment properties at ${settings.title}. Detailed listings with photos, prices, and location info.`,
    openGraph: {
      title: "Properties for Sale in Abuja | Verified Real Estate Listings",
      description: `Browse verified properties for sale in Abuja. Find luxury homes, land, and investment properties at ${settings.title}.`
    }
  };
}

export default async function PropertiesPage() {
  const [settings, properties] = await Promise.all([
    getSiteSettings(),
    getFeaturedProperties(24)
  ]);

  const breadcrumbListSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: settings.siteUrl },
      { "@type": "ListItem", position: 2, name: "Properties", item: settings.siteUrl + "/properties" }
    ]
  };

  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: settings.title + " - Properties",
    description: "Browse verified properties for sale in Abuja.",
    url: settings.siteUrl + "/properties",
    isPartOf: { "@type": "WebSite", name: settings.title, url: settings.siteUrl }
  };

  return (
    <>
      <JsonLd data={breadcrumbListSchema} id="properties-breadcrumb-jsonld" />
      <JsonLd data={collectionPageSchema} id="properties-collection-jsonld" />
      <div className="py-16 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4">
          <PropertiesClient properties={properties} />
        </div>
      </div>
    </>
  );
}
