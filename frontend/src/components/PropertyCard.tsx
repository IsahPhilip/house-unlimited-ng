import React from 'react';
import { Bath, Bed, Heart, MapPin, Ruler, Share2 } from 'lucide-react';
import { Property } from '../types';

interface PropertyCardProps {
  property: Property;
  isWishlisted: boolean;
  onWishlistToggle: (id: string, property?: Property) => void;
  onNavigate: (id: string) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ 
  property, 
  isWishlisted, 
  onWishlistToggle, 
  onNavigate 
}) => (
  <div 
    onClick={() => onNavigate(property.id)}
    className="relative overflow-hidden rounded-3xl border border-white/70 bg-white shadow-[0_20px_60px_-40px_rgba(15,23,42,0.45)] transition-all hover:-translate-y-1 hover:shadow-[0_30px_80px_-40px_rgba(15,23,42,0.55)] cursor-pointer"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-white to-slate-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
    <div className="relative aspect-[4/3] overflow-hidden">
      <img src={property.image} alt={property.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-slate-900/10 to-transparent"></div>
      <div className="absolute top-4 left-4 flex flex-wrap gap-2">
        <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg ${property.category === 'rent' ? 'bg-teal-600 text-white' : 'bg-teal-100 text-teal-800'}`}>
          For {property.category === 'rent' ? 'Rent' : 'Sale'}
        </span>
        <span className="px-3 py-1 bg-white/90 text-slate-900 rounded-full text-xs font-bold shadow-lg">{property.type}</span>
      </div>
      <div className="absolute top-4 right-4 flex flex-col space-y-2">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onWishlistToggle(property.id, property);
          }}
          className={`backdrop-blur p-2 rounded-full transition-all shadow-lg ${isWishlisted ? 'bg-red-500 text-white' : 'bg-white/90 text-slate-700 hover:text-red-500'}`}
          title="Save to wishlist"
        >
          <Heart className="w-4 h-4" fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            // Import handleShare from helpers
            import('../utils/helpers').then(({ handleShare }) => handleShare(property));
          }}
          className="bg-white/90 backdrop-blur p-2 rounded-full transition-all shadow-lg text-slate-700 hover:bg-teal-600 hover:text-white"
          title="Share property"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>
    </div>
    <div className="relative p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-slate-900 text-lg truncate group-hover:text-teal-600 transition-colors">{property.title}</h3>
        <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Featured</span>
      </div>
      <p className="text-slate-600 text-sm mb-4 flex items-center">
        <MapPin className="w-4 h-4 mr-1 text-teal-500" />
        {property.address}
      </p>
      <div className="flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 text-white px-3 py-1 text-xs font-semibold">
          <Bed className="w-3.5 h-3.5" /> {property.beds} Beds
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-600 text-white px-3 py-1 text-xs font-semibold">
          <Bath className="w-3.5 h-3.5" /> {property.baths} Baths
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-100 text-teal-800 px-3 py-1 text-xs font-semibold">
          <Ruler className="w-3.5 h-3.5" /> {property.sqft} sqft
        </span>
      </div>
    </div>
  </div>
);
