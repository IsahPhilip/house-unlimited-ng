import React from 'react';
import { Page } from '../types';
import { PROPERTIES } from '../utils/mockData';
import { PropertyCard } from '../components/PropertyCard';

const WishlistPage = ({ 
  wishlistIds, 
  onWishlistToggle, 
  setCurrentPage,
  onNavigate
}: { 
  wishlistIds: number[], 
  onWishlistToggle: (id: number) => void,
  setCurrentPage: (p: Page) => void,
  onNavigate: (id: number) => void
}) => {
  const wishlistProperties = PROPERTIES.filter(p => wishlistIds.includes(p.id));

  return (
    <div className="py-24 bg-gray-50 min-h-screen animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-12">
          <p className="text-teal-600 font-semibold mb-2 uppercase tracking-widest text-xs font-bold">Your Saved Items</p>
          <h1 className="text-4xl font-bold text-gray-900">My <span className="text-gray-400 italic font-light">Wishlist</span></h1>
        </div>

        {wishlistProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {wishlistProperties.map((p) => (
              <PropertyCard 
                key={p.id} 
                property={p} 
                isWishlisted={true}
                onWishlistToggle={onWishlistToggle}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-20 text-center border border-gray-100 shadow-sm">
            <div className="w-24 h-24 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">❤️</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">Start saving your favorite properties to keep track of them and get updates on price changes.</p>
            <button 
              onClick={() => setCurrentPage('property')}
              className="bg-teal-600 text-white px-10 py-4 rounded-xl font-bold shadow-lg shadow-teal-200 hover:shadow-teal-300 transition-all uppercase tracking-widest text-xs"
            >
              Explore Properties
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;