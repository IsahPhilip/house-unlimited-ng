import React from 'react';
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
          <svg className="w-4 h-4" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
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
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
          </svg>
        </button>
      </div>
    </div>
    <div className="p-5">
      <p className="text-teal-600 font-bold text-lg mb-1">{property.price}</p>
      <h3 className="font-bold text-gray-900 mb-2 truncate group-hover:text-teal-600 transition-colors">{property.title}</h3>
      <p className="text-gray-500 text-sm mb-4 flex items-center">
        <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
        {property.address}
      </p>
      <div className="flex justify-between items-center text-gray-600 text-xs font-medium border-t pt-4">
        <span className="flex items-center"><span className="mr-1 text-teal-500">🛏️</span> {property.beds} Beds</span>
        <span className="flex items-center"><span className="mr-1 text-teal-500">🚿</span> {property.baths} Bath</span>
        <span className="flex items-center"><span className="mr-1 text-teal-500">📐</span> {property.sqft} sqft</span>
      </div>
    </div>
  </div>
);
