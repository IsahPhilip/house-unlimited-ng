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
    className="bg-white rounded-2xl overflow-hidden shadow-md group transition-all hover:shadow-xl border border-gray-100 cursor-pointer"
  >
    <div className="relative aspect-[4/3] overflow-hidden">
      <img src={property.image} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      <div className="absolute top-4 left-4 flex space-x-2">
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${property.category === 'rent' ? 'bg-teal-600 text-white' : 'bg-teal-100 text-teal-800'}`}>
          For {property.category === 'rent' ? 'Rent' : 'Sale'}
        </span>
        <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-xs font-bold">{property.type}</span>
      </div>
      <div className="absolute top-4 right-4 flex flex-col space-y-2">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onWishlistToggle(property.id, property);
          }}
          className={`backdrop-blur p-2 rounded-full transition-all shadow-lg ${isWishlisted ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-600 hover:text-red-500'}`}
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
          className="bg-white/80 backdrop-blur p-2 rounded-full transition-all shadow-lg text-gray-600 hover:bg-teal-600 hover:text-white"
          title="Share property"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>
    </div>
    <div className="p-5">
      <p className="text-teal-600 font-bold text-lg mb-1">{property.price}</p>
      <h3 className="font-bold text-gray-900 mb-2 truncate group-hover:text-teal-600 transition-colors">{property.title}</h3>
      <p className="text-gray-500 text-sm mb-4 flex items-center">
        <MapPin className="w-4 h-4 mr-1 text-gray-400" />
        {property.address}
      </p>
      <div className="flex justify-between items-center text-gray-600 text-xs font-medium border-t pt-4">
        <span className="flex items-center"><Bed className="w-4 h-4 mr-1 text-teal-500" /> {property.beds} Beds</span>
        <span className="flex items-center"><Bath className="w-4 h-4 mr-1 text-teal-500" /> {property.baths} Bath</span>
        <span className="flex items-center"><Ruler className="w-4 h-4 mr-1 text-teal-500" /> {property.sqft} sqft</span>
      </div>
    </div>
  </div>
);
