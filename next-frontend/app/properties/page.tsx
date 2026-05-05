import type { Metadata } from "next";
import { PropertyPreviewCard } from "@/components/property-preview-card";
import { getFeaturedProperties, getSiteSettings } from "@/lib/wordpress";
import { Search } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    title: "Properties",
    description: `Featured houses and listings from ${settings.title}.`
  };
}

export default async function PropertiesPage() {
  const properties = await getFeaturedProperties(12);

  return (
    <div className="py-16 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Browse Our Listings
            </h1>
            <p className="text-gray-500">
              Discover verified properties with detailed information and high-quality images.
            </p>
          </div>

          <div className="flex items-center bg-white p-1 rounded-2xl shadow-sm border border-gray-100">
             <button className="px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center bg-[#005555] text-white shadow-md">
               <span className="mr-2 text-base">⊞</span> Grid
             </button>
             <button className="px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center text-gray-500 hover:text-[#005555]">
               <span className="mr-2 text-base">🗺</span> Map
             </button>
          </div>
        </div>

        {/* Filters & Results Summary */}
        <div className="flex flex-col md:flex-row justify-between mb-8 gap-4 items-center">
          <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100">
            <button className="px-8 py-2.5 rounded-lg capitalize font-bold transition-all bg-[#005555] text-white shadow-md">
              buy/invest
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-500">{properties.length} Results found</span>
            <select className="bg-white border border-gray-100 rounded-xl px-4 py-2 font-medium text-gray-600 outline-none focus:ring-2 focus:ring-[#005555] shadow-sm">
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>
        </div>

        {properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {properties.map((property) => (
              <PropertyPreviewCard key={property.slug} property={property} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-20 text-center border border-dashed border-gray-200">
            <div className="text-6xl mb-6">🏜️</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No matching properties found</h3>
            <p className="text-gray-500 mb-8">Try adjusting your filters or check back later for new listings.</p>
            <button className="text-[#005555] font-bold hover:underline">Reset all filters</button>
          </div>
        )}
      </div>
    </div>
  );
}
