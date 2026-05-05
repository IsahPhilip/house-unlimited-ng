import Link from "next/link";
import type { PropertyPreview } from "@/lib/wordpress";
import { MapPin, Bed, Bath, Square } from "lucide-react";

export function PropertyPreviewCard({ property }: { property: PropertyPreview }) {
  return (
    <Link href={`/properties/${property.slug}`} className="block">
      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all group">
        <div className="relative aspect-[4/3] overflow-hidden">
          {property.image ? (
            <img src={property.image} alt={property.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs uppercase tracking-widest">
              No Image
            </div>
          )}
          <div className="absolute top-4 right-4 bg-[#005555] text-white px-3 py-1 rounded-full text-xs font-bold">
            {property.type || "Property"}
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#005555] font-bold text-lg">{property.price || "Contact for price"}</span>
            <div className="flex items-center text-gray-400 text-sm">
              <MapPin className="w-4 h-4 mr-1" />
              {property.location || "Location"}
            </div>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-[#005555] transition-colors line-clamp-2 leading-snug">{property.title}</h3>
          <p className="text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed">{property.excerpt}</p>
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center space-x-3">
              <span className="flex items-center">
                <Bed className="w-4 h-4 mr-1" />
                3
              </span>
              <span className="flex items-center">
                <Bath className="w-4 h-4 mr-1" />
                2
              </span>
              <span className="flex items-center">
                <Square className="w-4 h-4 mr-1" />
                2000 sqft
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
