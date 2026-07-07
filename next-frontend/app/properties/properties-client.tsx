"use client";

import { useState, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import { LayoutGrid, Map } from "lucide-react";
import { PropertyPreviewCard } from "@/components/property-preview-card";
import type { PropertyPreview } from "@/lib/wordpress";

const PropertiesMap = dynamic(
  () => import("./properties-map").then((m) => m.PropertiesMap),
  { ssr: false, loading: () => <div className="w-full h-full rounded-3xl bg-gray-100 animate-pulse" /> }
);

type SortKey = "default" | "price-asc" | "price-desc";

function parsePrice(price: string | undefined): number {
  if (!price) return 0;
  return Number(price.replace(/[^0-9.]/g, "")) || 0;
}

export function PropertiesClient({ properties }: { properties: PropertyPreview[] }) {
  const [view, setView] = useState<"grid" | "map">("grid");
  const [sort, setSort] = useState<SortKey>("default");

  const sorted = useMemo(() => {
    if (sort === "default") return properties;
    return [...properties].sort((a, b) => {
      const diff = parsePrice(a.price) - parsePrice(b.price);
      return sort === "price-asc" ? diff : -diff;
    });
  }, [properties, sort]);

  const switchView = useCallback((v: "grid" | "map") => setView(v), []);

  return (
    <>
      {/* Toolbar */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Browse Our Listings</h1>
          <p className="text-gray-500">Discover verified properties with detailed information and high-quality images.</p>
        </div>
        <div className="flex items-center bg-white p-1 rounded-2xl shadow-sm border border-gray-100">
          <button
            onClick={() => switchView("grid")}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${view === "grid" ? "bg-[#005555] text-white shadow-md" : "text-gray-500 hover:text-[#005555]"}`}
          >
            <LayoutGrid className="w-4 h-4" /> Grid
          </button>
          <button
            onClick={() => switchView("map")}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${view === "map" ? "bg-[#005555] text-white shadow-md" : "text-gray-500 hover:text-[#005555]"}`}
          >
            <Map className="w-4 h-4" /> Map
          </button>
        </div>
      </div>

      {/* Filters bar */}
      <div className="flex flex-col md:flex-row justify-between mb-8 gap-4 items-center">
        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100">
          <button className="px-8 py-2.5 rounded-lg capitalize font-bold transition-all bg-[#005555] text-white shadow-md">
            buy/invest
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-500">{sorted.length} Results found</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="bg-white border border-gray-100 rounded-xl px-4 py-2 font-medium text-gray-600 outline-none focus:ring-2 focus:ring-[#005555] shadow-sm"
          >
            <option value="default">Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Grid view */}
      {view === "grid" && (
        sorted.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {sorted.map((property) => (
              <PropertyPreviewCard key={property.slug} property={property} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-20 text-center border border-dashed border-gray-200">
            <div className="text-6xl mb-6">🏠</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-500">Check back later for new listings.</p>
          </div>
        )
      )}

      {/* Map view */}
      {view === "map" && (
        <div className="w-full h-[600px] rounded-3xl overflow-hidden shadow-sm border border-gray-100">
          <PropertiesMap properties={sorted} />
        </div>
      )}
    </>
  );
}
