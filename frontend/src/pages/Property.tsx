import React, { useState } from 'react';
import { Property } from '../types';
import { PROPERTIES } from '../utils/mockData';
import { PropertyCard } from '../components/PropertyCard';
import { MapView } from '../components/MapView';

interface PropertyPageProps {
  searchCriteria: any | null;
  wishlistIds: number[];
  onWishlistToggle: (id: number) => void;
  onNavigate: (id: number) => void;
}

export const PropertyPage: React.FC<PropertyPageProps> = ({ 
  searchCriteria, 
  wishlistIds, 
  onWishlistToggle,
  onNavigate
}) => {
  const [filter, setFilter] = useState<'all' | 'rent' | 'sale'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Functional Filtering Logic
  const getFilteredProperties = () => {
    let list = [...PROPERTIES];

    // Category Filter
    if (filter !== 'all') {
      list = list.filter(p => p.category === filter);
    }

    // Search Criteria logic
    if (searchCriteria) {
      if (searchCriteria.location) {
        list = list.filter(p => p.address.toLowerCase().includes(searchCriteria.location.toLowerCase()));
      }
      if (searchCriteria.type && searchCriteria.type !== 'all' && searchCriteria.type !== 'Select Type') {
        list = list.filter(p => p.type.toLowerCase() === searchCriteria.type.toLowerCase());
      }
      // Price range filtering
      if (searchCriteria.priceRange === '$30,000 - $80,000') {
        list = list.filter(p => p.priceValue >= 30000 && p.priceValue <= 80000);
      } else if (searchCriteria.priceRange === '$80,000 - $200,000') {
        list = list.filter(p => p.priceValue > 80000 && p.priceValue <= 200000);
      } else if (searchCriteria.priceRange === '$200,000+') {
        list = list.filter(p => p.priceValue > 200000);
      }
    }

    // Sorting
    list.sort((a, b) => sortOrder === 'asc' ? a.priceValue - b.priceValue : b.priceValue - a.priceValue);

    return list;
  };

  const filtered = getFilteredProperties();

  return (
    <div className="py-16 bg-gray-50 min-h-screen animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {searchCriteria ? 'Search Results' : 'Browse Our Listings'}
            </h1>
            {searchCriteria && (
              <p className="text-gray-500">
                Showing results for {searchCriteria.location || 'Any location'} • {searchCriteria.type} • {searchCriteria.priceRange}
              </p>
            )}
          </div>
          
          <div className="flex items-center bg-white p-1 rounded-2xl shadow-sm border border-gray-100">
             <button 
              onClick={() => setViewMode('grid')}
              className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center ${viewMode === 'grid' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:text-blue-600'}`}
             >
               <span className="mr-2 text-base">⊞</span> Grid
             </button>
             <button 
              onClick={() => setViewMode('map')}
              className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center ${viewMode === 'map' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:text-blue-600'}`}
             >
               <span className="mr-2 text-base">🗺</span> Map
             </button>
          </div>
        </div>
        
        {/* Filters & Results Summary */}
        <div className="flex flex-col md:flex-row justify-between mb-8 gap-4 items-center">
          <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100">
            {(['all', 'rent', 'sale'] as const).map(f => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                className={`px-8 py-2.5 rounded-lg capitalize font-bold transition-all ${filter === f ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:text-blue-600'}`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-500">{filtered.length} Results found</span>
            <select 
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              className="bg-white border border-gray-100 rounded-xl px-4 py-2 font-medium text-gray-600 outline-none focus:ring-2 focus:ring-blue-600 shadow-sm"
            >
              <option value="asc">Price: Low to High</option>
              <option value="desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {filtered.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {filtered.map((p) => (
                <PropertyCard 
                  key={p.id} 
                  property={p} 
                  isWishlisted={wishlistIds.includes(p.id)}
                  onWishlistToggle={onWishlistToggle}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          ) : (
            <div className="animate-in fade-in duration-700">
              <MapView properties={filtered} onNavigate={onNavigate} />
              <p className="mt-4 text-center text-xs text-gray-400 italic">Click on markers to view property previews.</p>
            </div>
          )
        ) : (
          <div className="bg-white rounded-3xl p-20 text-center border border-dashed border-gray-200">
            <div className="text-6xl mb-6">🏜️</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No matching properties found</h3>
            <p className="text-gray-500 mb-8">Try adjusting your filters or search location to find what you're looking for.</p>
            <button onClick={() => { setFilter('all'); window.location.reload(); }} className="text-blue-600 font-bold hover:underline">Reset all filters</button>
          </div>
        )}

      </div>
    </div>
  );
};
