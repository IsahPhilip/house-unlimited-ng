import React from 'react';
import { Heart } from 'lucide-react';
import { Page } from '../types';
import { PropertyCard } from '../components/PropertyCard';

const WishlistPage = ({ 
  wishlistIds, 
  wishlistProperties,
  onWishlistToggle, 
  setAppPage,
  onNavigate
}: { 
  wishlistIds: string[], 
  wishlistProperties: any[],
  onWishlistToggle: (id: string, property?: any) => void,
  setAppPage: (p: Page) => void,
  onNavigate: (id: string) => void
}) => {
  const pageSize = 9;
  const [currentPage, setCurrentPage] = React.useState(1);
  const hasRemoteWishlist = wishlistProperties && wishlistProperties.length > 0;
  const resolvedWishlist = hasRemoteWishlist ? wishlistProperties : [];
  const totalPages = Math.max(1, Math.ceil(resolvedWishlist.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const pagedWishlist = resolvedWishlist.slice(startIndex, startIndex + pageSize);

  return (
    <div className="py-24 bg-gray-50 min-h-screen animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-12">
          <p className="text-teal-600 font-semibold mb-2 uppercase tracking-widest text-xs font-bold">Your Saved Items</p>
          <h1 className="text-4xl font-bold text-gray-900">My <span className="text-gray-400 italic font-light">Wishlist</span></h1>
        </div>

        {pagedWishlist.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pagedWishlist.map((p: any) => (
              <PropertyCard 
                key={p._id || p.id} 
                property={{
                  id: p._id || p.id,
                  title: p.title,
                  price: p.price || p.priceValue,
                  priceValue: p.priceValue || 0,
                  type: p.type,
                  category: p.category,
                  address: p.address,
                  beds: p.beds,
                  baths: p.baths,
                  sqft: p.sqft,
                  image: p.featuredImage || p.image || p.images?.[0] || '',
                  images: p.images,
                  description: p.description || '',
                  amenities: p.amenities || [],
                  coordinates: p.coordinates || [0, 0],
                }} 
                isWishlisted={true}
                onWishlistToggle={onWishlistToggle}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-20 text-center border border-gray-100 shadow-sm">
            <div className="w-24 h-24 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">Start saving your favorite properties to keep track of them and get updates on price changes.</p>
            <button 
              onClick={() => setAppPage('property')}
              className="bg-teal-600 text-white px-10 py-4 rounded-xl font-bold shadow-lg shadow-teal-200 hover:shadow-teal-300 transition-all uppercase tracking-widest text-xs"
            >
              Explore Properties
            </button>
          </div>
        )}

        {resolvedWishlist.length > pageSize && (
          <div className="flex justify-center items-center mt-10 gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm border border-gray-200 rounded-lg disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm border border-gray-200 rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
