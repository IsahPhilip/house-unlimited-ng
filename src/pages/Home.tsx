import React, { useState } from 'react';
import { SearchCriteria, Property } from '../types';
import { PropertyCard } from '../components/PropertyCard';

interface HomeProps {
  onSearch: (criteria: SearchCriteria) => void;
  wishlistIds: number[];
  onWishlistToggle: (id: number) => void;
  onNavigate: (id: number) => void;
}

export const Home: React.FC<HomeProps> = ({
  onSearch,
  wishlistIds,
  onWishlistToggle,
  onNavigate
}) => {
  const [criteria, setCriteria] = useState<SearchCriteria>({
    location: '',
    type: 'Apartment',
    priceRange: '$30,000 - $80,000',
    category: 'buy'
  });

  const propertyTypes = [
    { icon: '🏢', label: 'Apartment', count: '3,452 Properties' },
    { icon: '💼', label: 'Office', count: '1,252 Properties' },
    { icon: '🏠', label: 'House', count: '5,485 Properties' },
    { icon: '🏘️', label: 'Villa', count: '2,841 Properties' },
    { icon: '🏥', label: 'Medical', count: '1,052 Properties' },
  ];

  return (
    <div className="animate-in fade-in duration-500">
      {/* Hero Section */}
      <section className="relative h-[650px] flex items-center">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1920" alt="Hero" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/40 to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
          <div className="max-w-2xl">
            <p className="text-blue-600 font-semibold mb-4 tracking-wide uppercase tracking-[0.2em] text-xs font-bold">Find Your Dream Property Easily</p>
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
              Instant Property Deals:<br />
              <span className="text-blue-600">Buy, Sell, and Rent</span>
            </h1>
            <p className="text-gray-600 text-lg mb-10 max-w-lg">Experience the next generation of real estate discovery. We use cutting-edge AI to match you with your perfect home.</p>

            <div className="bg-white p-2 rounded-2xl shadow-2xl inline-flex flex-col w-full md:w-auto transition-all">
              <div className="flex p-1">
                <button
                  onClick={() => setCriteria({...criteria, category: 'buy'})}
                  className={`px-8 py-2.5 rounded-xl font-bold transition-all ${criteria.category === 'buy' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-blue-600'}`}
                >
                  Buy
                </button>
                <button
                  onClick={() => setCriteria({...criteria, category: 'rent'})}
                  className={`px-8 py-2.5 rounded-xl font-bold transition-all ${criteria.category === 'rent' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-blue-600'}`}
                >
                  Rent
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 items-center">
                <div className="relative">
                  <p className="text-xs font-bold text-gray-400 uppercase mb-1">Location</p>
                  <input
                    type="text"
                    value={criteria.location}
                    onChange={(e) => setCriteria({...criteria, location: e.target.value})}
                    placeholder="e.g. Los Angeles"
                    className="text-gray-900 font-bold text-sm bg-transparent border-none p-0 focus:ring-0 outline-none w-full placeholder:text-gray-300"
                  />
                </div>
                <div className="border-l border-gray-100 pl-4">
                  <p className="text-xs font-bold text-gray-400 uppercase mb-1">Type</p>
                  <select
                    value={criteria.type}
                    onChange={(e) => setCriteria({...criteria, type: e.target.value})}
                    className="text-gray-900 font-bold text-sm bg-transparent border-none p-0 focus:ring-0 outline-none w-full cursor-pointer"
                  >
                    <option>Apartment</option>
                    <option>Villa</option>
                    <option>Office</option>
                    <option>House</option>
                  </select>
                </div>
                <div className="border-l border-gray-100 pl-4">
                  <p className="text-xs font-bold text-gray-400 uppercase mb-1">Price Range</p>
                  <select
                    value={criteria.priceRange}
                    onChange={(e) => setCriteria({...criteria, priceRange: e.target.value})}
                    className="text-gray-900 font-bold text-sm bg-transparent border-none p-0 focus:ring-0 outline-none w-full cursor-pointer"
                  >
                    <option>$30,000 - $80,000</option>
                    <option>$80,000 - $200,000</option>
                    <option>$200,000+</option>
                  </select>
                </div>
                <button
                  onClick={() => onSearch(criteria)}
                  className="bg-blue-600 text-white h-14 w-14 md:w-full rounded-xl flex items-center justify-center font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                >
                  <span className="md:hidden">🔍</span>
                  <span className="hidden md:block">Search</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Property Types */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 text-center mb-16">
          <p className="text-blue-600 font-semibold mb-2 uppercase tracking-widest text-xs font-bold">Property Types</p>
          <h2 className="text-4xl font-bold text-gray-900">Explore Property <span className="text-gray-400 italic font-light">Types</span></h2>
        </div>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-5 gap-6">
          {propertyTypes.map((type, idx) => (
            <div
              key={idx}
              onClick={() => onSearch({ location: '', type: type.label, priceRange: 'all', category: 'all' })}
              className={`p-8 rounded-3xl transition-all cursor-pointer group bg-white border border-gray-100 hover:border-blue-500 hover:shadow-xl hover:-translate-y-1`}
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{type.icon}</div>
              <h4 className="font-bold mb-1 text-gray-900 group-hover:text-blue-600 transition-colors">{type.label}</h4>
              <p className={`text-[10px] font-bold uppercase tracking-wider text-gray-400`}>{type.count}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us / Features & Benefits */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-blue-600 font-semibold mb-2 uppercase tracking-widest text-xs font-bold">Why Choose Us</p>
            <h2 className="text-4xl font-bold text-gray-900">Discover Our <span className="text-gray-400 italic font-light">Features & Benefits</span></h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Features List */}
            <div className="space-y-8">
              {[
                {
                  icon: '🔍',
                  title: 'Advanced Search',
                  description: 'Powerful search with AI-driven recommendations to find your perfect property match.'
                },
                {
                  icon: '📱',
                  title: 'Mobile Friendly',
                  description: 'Responsive design that works seamlessly on all devices for property browsing on-the-go.'
                },
                {
                  icon: '⭐',
                  title: 'Expert Agents',
                  description: 'Connect with our network of experienced real estate professionals ready to assist you.'
                },
                {
                  icon: '💰',
                  title: 'Best Deals',
                  description: 'Access exclusive listings and competitive pricing you won\'t find elsewhere.'
                }
              ].map((feature, idx) => (
                <div key={idx} className="flex items-start space-x-4 group cursor-pointer hover:translate-x-2 transition-transform">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{feature.title}</h4>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Benefits Image/Content */}
            <div className="relative bg-blue-600 rounded-3xl p-8 md:p-12 text-white overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <img src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&q=80&w=800" alt="Happy family" className="w-full h-full object-cover" />
              </div>
              <div className="relative z-10">
                <h3 className="text-3xl font-bold mb-4">Your Dream Home Awaits</h3>
                <p className="text-blue-100 mb-6">Join thousands of satisfied customers who have found their perfect home through our platform.</p>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <span className="bg-white/20 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">✓</span>
                    <span className="text-sm">Verified listings only</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="bg-white/20 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">✓</span>
                    <span className="text-sm">24/7 customer support</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="bg-white/20 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">✓</span>
                    <span className="text-sm">Secure transactions</span>
                  </div>
                </div>
                <button
                  onClick={() => onSearch({ location: '', type: 'all', priceRange: 'all', category: 'all' })}
                  className="mt-8 bg-white text-blue-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-all shadow-lg"
                >
                  Start Your Search
                </button>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: '10K+', label: 'Properties Listed' },
              { number: '5K+', label: 'Happy Customers' },
              { number: '100+', label: 'Expert Agents' },
              { number: '24/7', label: 'Customer Support' }
            ].map((stat, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <h4 className="text-3xl font-bold text-blue-600 mb-2">{stat.number}</h4>
                <p className="text-gray-600 text-sm font-semibold">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Properties Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-end mb-12">
          <div>
            <p className="text-blue-600 font-semibold mb-2 uppercase tracking-widest text-xs font-bold">Popular Properties</p>
            <h2 className="text-4xl font-bold text-gray-900">Discover <span className="text-gray-400 italic font-light">Popular Properties</span></h2>
          </div>
          <button onClick={() => onSearch({ location: '', type: 'all', priceRange: 'all', category: 'all' })} className="bg-blue-600 text-white px-8 py-3 rounded-full flex items-center group font-bold text-sm shadow-lg shadow-blue-100">
            Visit All Properties <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Mock properties would go here */}
          <PropertyCard
            property={{
              id: 1,
              title: 'Riverview Retreat',
              price: '$6,000/month',
              priceValue: 6000,
              type: 'Apartment',
              category: 'rent',
              address: '6391 Elgin St. Celina, Delaware 10299',
              beds: 4,
              baths: 2,
              sqft: 2148,
              image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
              description: 'Experience luxury living in this spacious 4-bedroom apartment featuring stunning river views.',
              amenities: ['River View', 'Gourmet Kitchen', 'Parking', 'Gym', 'Balcony', 'Smart Home System'],
              coordinates: [39.7392, -104.9903]
            }}
            isWishlisted={wishlistIds.includes(1)}
            onWishlistToggle={onWishlistToggle}
            onNavigate={onNavigate}
          />
          <PropertyCard
            property={{
              id: 2,
              title: 'Sunset Vista Villa',
              price: '$396,000',
              priceValue: 396000,
              type: 'Villa',
              category: 'sale',
              address: '1901 Thornridge Cir., Hawaii 81063',
              beds: 2,
              baths: 1,
              sqft: 1148,
              image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800',
              description: 'Escape to paradise in this charming Hawaiian villa.',
              amenities: ['Ocean View', 'Private Garden', 'Lanai', 'Outdoor Shower', 'Solar Panels'],
              coordinates: [21.3069, -157.8583]
            }}
            isWishlisted={wishlistIds.includes(2)}
            onWishlistToggle={onWishlistToggle}
            onNavigate={onNavigate}
          />
          <PropertyCard
            property={{
              id: 3,
              title: 'Pineview Place',
              price: '$125,000',
              priceValue: 125000,
              type: 'Apartment',
              category: 'sale',
              address: '2464 Royal Ln., New Jersey 45463',
              beds: 1,
              baths: 1,
              sqft: 1248,
              image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800',
              description: 'Efficient and elegant, Pineview Place is an ideal starter home.',
              amenities: ['Park View', 'Updated Appliances', 'Security System', 'Laundry In-unit'],
              coordinates: [40.7128, -74.0060]
            }}
            isWishlisted={wishlistIds.includes(3)}
            onWishlistToggle={onWishlistToggle}
            onNavigate={onNavigate}
          />
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 text-center mb-16">
          <p className="text-blue-600 font-semibold mb-2 uppercase tracking-widest text-xs font-bold">Our Testimonials</p>
          <h2 className="text-4xl font-bold text-gray-900">What Our <span className="text-gray-400 italic font-light font-normal">Client Say About Us</span></h2>
        </div>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              name: 'Jenny Wilson', 
              img: 'https://i.pravatar.cc/150?u=jenny', 
              text: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa.'
            }, 
            {
              name: 'Esther Howard', 
              img: 'https://i.pravatar.cc/150?u=esther', 
              text: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa.'
            }
          ].map((t, i) => (
            <div key={i} className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 flex items-start space-x-6">
              <img src={t.img} alt={t.name} className="w-20 h-20 rounded-full border-4 border-blue-50 object-cover" />
              <div className="flex-1">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h4 className="font-bold text-gray-900">{t.name}</h4>
                    <p className="text-gray-400 text-sm">Customer</p>
                  </div>
                  <div className="text-blue-200 text-6xl font-serif h-10 overflow-hidden leading-[1]">"</div>
                </div>
                <p className="text-gray-600 leading-relaxed italic text-sm">"{t.text}"</p>
                <div className="mt-4 flex text-yellow-400 space-x-1">
                  {'★★★★★'.split('').map((s, idx) => <span key={idx} className="text-xs">{s}</span>)}
                  <span className="text-gray-900 font-bold ml-2 text-xs">5.0</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Banner (before footer) */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-blue-700 rounded-3xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1920" alt="Background" className="w-full h-full object-cover" />
            </div>
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Find Your Perfect Property?</h2>
                <p className="text-blue-100 mb-6 max-w-lg">Start your real estate journey today with our comprehensive platform. Whether you're buying, selling, or renting, we have the perfect solution for you.</p>
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => onSearch({ location: '', type: 'all', priceRange: 'all', category: 'buy' })}
                    className="bg-white text-blue-700 px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition-all shadow-lg"
                  >
                    Browse Properties for Sale
                  </button>
                  <button
                    onClick={() => onSearch({ location: '', type: 'all', priceRange: 'all', category: 'rent' })}
                    className="border-2 border-white text-white px-6 py-3 rounded-full font-bold hover:bg-white hover:text-blue-700 transition-all"
                  >
                    Explore Rentals
                  </button>
                </div>
              </div>
              <div className="flex justify-center lg:justify-end">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-sm">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center">
                      <span className="text-2xl">📞</span>
                    </div>
                    <div>
                      <p className="text-white/80 text-sm">Contact our team</p>
                      <p className="font-bold text-lg">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  <button className="w-full bg-white text-blue-700 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all">
                    Get in Touch
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
