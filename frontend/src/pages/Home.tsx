import React, { useEffect, useState } from 'react';
import maitamaHero from '../img/maitama-ii.jpeg';
import {
  ArrowRight,
  Briefcase,
  Building,
  Building2,
  DollarSign,
  Home as HomeIcon,
  MapPin,
  Phone,
  Search,
  Smartphone,
  Star,
  Stethoscope
} from 'lucide-react';
import { SearchCriteria, Property } from '../types';
import { getFeaturedProperties } from '../services/api';
import { PropertyCard } from '../components/PropertyCard';

interface HomeProps {
  onSearch: (criteria: SearchCriteria) => void;
  wishlistIds: string[];
  onWishlistToggle: (id: string, property?: Property) => void;
  onNavigate: (id: string) => void;
}

export const Home: React.FC<HomeProps> = ({
  onSearch,
  wishlistIds,
  onWishlistToggle,
  onNavigate
}) => {
  const [featured, setFeatured] = useState<Property[]>([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [criteria, setCriteria] = useState<SearchCriteria>({
    location: '',
    type: 'Apartment',
    priceRange: '$30,000 - $80,000',
    category: 'buy'
  });

  const propertyTypes = [
    { icon: Building2, label: 'Apartment', count: '3,452 Properties' },
    { icon: Briefcase, label: 'Office', count: '1,252 Properties' },
    { icon: HomeIcon, label: 'House', count: '5,485 Properties' },
    { icon: Building, label: 'Villa', count: '2,841 Properties' },
    { icon: Stethoscope, label: 'Medical', count: '1,052 Properties' },
  ];

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const data = await getFeaturedProperties();
        const mapped = (data || []).map((p: any) => ({
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
        }));
        setFeatured(mapped);
      } catch (error) {
        console.error('Failed to load featured properties:', error);
      } finally {
        setLoadingFeatured(false);
      }
    };

    loadFeatured();
  }, []);

  return (
    <div className="animate-in fade-in duration-500">
      {/* Hero Section */}
      <section className="relative h-[650px] flex items-center">
        <div className="absolute inset-0 z-0">
          <img src={maitamaHero} alt="Hero" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/40 to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
          <div className="max-w-2xl">
            <p className="text-teal-600 font-semibold mb-4 tracking-wide uppercase tracking-[0.2em] text-xs font-bold">Find Your Dream Property Easily</p>
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
              Instant Property Deals:<br />
              <span className="text-teal-600">Buy, Sell, and Rent</span>
            </h1>
            <p className="text-gray-600 text-lg mb-10 max-w-lg">Experience the next generation of real estate discovery. We use cutting-edge AI to match you with your perfect home.</p>

            <div className="bg-white p-2 rounded-2xl shadow-2xl inline-flex flex-col w-full md:w-auto transition-all">
              <div className="flex p-1">
                <button
                  onClick={() => setCriteria({...criteria, category: 'buy'})}
                  className={`px-8 py-2.5 rounded-xl font-bold transition-all ${criteria.category === 'buy' ? 'bg-teal-600 text-white' : 'text-gray-500 hover:text-teal-600'}`}
                >
                  Buy
                </button>
                <button
                  onClick={() => setCriteria({...criteria, category: 'rent'})}
                  className={`px-8 py-2.5 rounded-xl font-bold transition-all ${criteria.category === 'rent' ? 'bg-teal-600 text-white' : 'text-gray-500 hover:text-teal-600'}`}
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
                    placeholder="e.g. Maitama 2, Abuja"
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
                    <option>N50,000,000 - 100,000,000</option>
                    <option>N150,000,000 - 300,000,000</option>
                    <option>N300,000,000+</option>
                  </select>
                </div>
                <button
                  onClick={() => onSearch(criteria)}
                  className="bg-teal-600 text-white h-14 w-14 md:w-full rounded-xl flex items-center justify-center font-bold hover:bg-teal-700 transition-all shadow-lg shadow-teal-200"
                >
                  <Search className="md:hidden w-5 h-5" />
                  <span className="hidden md:block">Search</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Verified Listings Highlight */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-stretch">
            <div className="lg:col-span-2">
              <p className="text-teal-600 font-semibold mb-2 uppercase tracking-widest text-xs font-bold">Trust & Transparency</p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Verified Listings, Clearer Decisions
              </h2>
              <p className="text-gray-600 mb-6">
                We verify identity, ownership, and on-site details before a listing goes live. That means less noise,
                faster shortlists, and more confident decisions.
              </p>
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                  <span>Verification Coverage</span>
                  <span className="font-bold text-teal-600">98%+</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full w-[92%] bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full"></div>
                </div>
                <p className="text-xs text-gray-500 mt-3">Listings are verified within 48 hours in most cases.</p>
              </div>
            </div>
            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: HomeIcon, label: 'Verified Owners', detail: 'ID, title & ownership checks' },
                { icon: Building2, label: 'On‑Site Inspection', detail: 'Condition & amenities validated' },
                { icon: DollarSign, label: 'Price Validation', detail: 'Benchmarking vs. market comps' },
                { icon: Smartphone, label: 'Secure Inquiry', detail: 'Protected messaging and logs' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="border border-gray-100 rounded-2xl p-5 bg-white shadow-sm hover:shadow-md transition-all">
                    <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center mb-3">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="text-gray-900 font-bold text-sm mb-1">{item.label}</div>
                    <div className="text-xs text-gray-500">{item.detail}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Services / What We Do */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 text-center mb-16">
          <p className="text-teal-600 font-semibold mb-2 uppercase tracking-widest text-xs font-bold">Services</p>
          <h2 className="text-4xl font-bold text-gray-900">Who We <span className="text-gray-400 italic font-light">Serve</span></h2>
          <p className="text-gray-600 mt-3">Tailored support for every stage of your property journey.</p>
        </div>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: HomeIcon, title: 'Buy a Home', desc: 'Find the right home faster with verified listings and guided tours.' },
            { icon: DollarSign, title: 'Sell a Home', desc: 'Price it right, market it well, and close with confidence.' },
            { icon: Building2, title: 'Luxury Properties', desc: 'Discreet, curated access to premium homes and estates.' },
            { icon: Building, title: 'Investment / Rentals', desc: 'Identify high‑yield opportunities and stable rental income.' },
            { icon: Briefcase, title: 'Relocation Services', desc: 'Move smoothly with local insights, logistics, and housing support.' },
          ].map((service) => {
            const Icon = service.icon;
            return (
              <div key={service.title} className="p-6 rounded-3xl transition-all bg-white border border-gray-100 hover:border-teal-500 hover:shadow-xl">
                <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-600 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">{service.title}</h4>
                <p className="text-sm text-gray-600">{service.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-end mb-12">
          <div>
            <p className="text-teal-600 font-semibold mb-2 uppercase tracking-widest text-xs font-bold">Featured Listings</p>
            <h2 className="text-4xl font-bold text-gray-900">Discover <span className="text-gray-400 italic font-light">Featured Properties</span></h2>
          </div>
          <button onClick={() => onSearch({ location: '', type: 'all', priceRange: 'all', category: 'all' })} className="bg-teal-600 text-white px-8 py-3 rounded-full flex items-center group font-bold text-sm shadow-lg shadow-teal-100">
            Visit All Properties <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          {loadingFeatured ? (
            <div className="col-span-full text-center text-gray-500">Loading featured properties...</div>
          ) : featured.length > 0 ? (
            featured.map((p) => (
              <PropertyCard
                key={p.id}
                property={p}
                isWishlisted={wishlistIds.includes(p.id)}
                onWishlistToggle={onWishlistToggle}
                onNavigate={onNavigate}
              />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500">No featured properties available.</div>
          )}
        </div>
      </section>

      {/* Why Choose Us / Features & Benefits */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-teal-600 font-semibold mb-2 uppercase tracking-widest text-xs font-bold">Why Choose Us</p>
            <h2 className="text-4xl font-bold text-gray-900">Built to <span className="text-gray-400 italic font-light">Outperform</span></h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { icon: MapPin, title: 'Local Market Expertise', desc: 'Neighborhood‑level insight that protects your investment.' },
                { icon: Search, title: 'Data‑Driven Pricing', desc: 'Pricing strategies backed by real comps and demand data.' },
                { icon: Smartphone, title: 'Pro Photography & Marketing', desc: 'High‑impact visuals and targeted campaigns that convert.' },
                { icon: Briefcase, title: 'Strong Negotiation', desc: 'We secure favorable terms without slowing the deal.' },
                { icon: Star, title: 'Concierge Service', desc: 'Personalized guidance from shortlist to closing.' },
              ].map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.title} className="p-6 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all">
                    <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center mb-3">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-gray-900 mb-1 text-sm">{feature.title}</h4>
                    <p className="text-xs text-gray-600">{feature.desc}</p>
                  </div>
                );
              })}
            </div>

            <div className="relative bg-teal-600 rounded-3xl p-8 md:p-12 text-white overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <img src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&q=80&w=800" alt="Happy family" className="w-full h-full object-cover" />
              </div>
              <div className="relative z-10">
                <h3 className="text-3xl font-bold mb-4">A Partner, Not Just a Platform</h3>
                <p className="text-teal-100 mb-6">We combine market intelligence with hands‑on support to help you move faster and smarter.</p>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <span className="bg-white/20 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">✓</span>
                    <span className="text-sm">Verified listings only</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="bg-white/20 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">✓</span>
                    <span className="text-sm">Expert agent support</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="bg-white/20 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">✓</span>
                    <span className="text-sm">Secure transactions</span>
                  </div>
                </div>
                <button
                  onClick={() => onSearch({ location: '', type: 'all', priceRange: 'all', category: 'all' })}
                  className="mt-8 bg-white text-teal-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-all shadow-lg"
                >
                  Start Your Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process / How It Works */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-teal-600 font-semibold mb-2 uppercase tracking-widest text-xs font-bold">How It Works</p>
            <h2 className="text-4xl font-bold text-gray-900">Simple Steps to <span className="text-gray-400 italic font-light">Your Home</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Book a consultation', text: 'Tell us your goals and preferred locations.' },
              { step: '02', title: 'Get a custom plan', text: 'We shortlist options tailored to your budget and needs.' },
              { step: '03', title: 'Tour or market homes', text: 'View verified listings or list with pro marketing.' },
              { step: '04', title: 'Close with confidence', text: 'Negotiation, paperwork, and secure closing handled.' },
            ].map((item) => (
              <div key={item.step} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all">
                <div className="text-teal-600 text-sm font-bold mb-3">Step {item.step}</div>
                <h4 className="font-bold text-gray-900 mb-2">{item.title}</h4>
                <p className="text-sm text-gray-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Testimonials */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 text-center mb-16">
          <p className="text-teal-600 font-semibold mb-2 uppercase tracking-widest text-xs font-bold">Our Testimonials</p>
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
              <img src={t.img} alt={t.name} className="w-20 h-20 rounded-full border-4 border-teal-50 object-cover" />
              <div className="flex-1">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h4 className="font-bold text-gray-900">{t.name}</h4>
                    <p className="text-gray-400 text-sm">Customer</p>
                  </div>
                  <div className="text-teal-200 text-6xl font-serif h-10 overflow-hidden leading-[1]">"</div>
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

      {/* Lead Magnet / CTA Section */}
      <section className="py-16 bg-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-teal-700 rounded-3xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1920" alt="Background" className="w-full h-full object-cover" />
            </div>
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Find Your Perfect Property?</h2>
                <p className="text-teal-100 mb-6 max-w-lg">Start your real estate journey today with our comprehensive platform. Whether you're buying, selling, or renting, we have the perfect solution for you.</p>
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => onSearch({ location: '', type: 'all', priceRange: 'all', category: 'buy' })}
                    className="bg-white text-teal-700 px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition-all shadow-lg"
                  >
                    Browse Properties for Sale
                  </button>
                  <button
                    onClick={() => onSearch({ location: '', type: 'all', priceRange: 'all', category: 'rent' })}
                    className="border-2 border-white text-white px-6 py-3 rounded-full font-bold hover:bg-white hover:text-teal-700 transition-all"
                  >
                    Explore Rentals
                  </button>
                </div>
              </div>
              <div className="flex justify-center lg:justify-end">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-sm">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-white/80 text-sm">Contact our team</p>
                      <p className="font-bold text-lg">+234 904 375 2708</p>
                    </div>
                  </div>
                  <button className="w-full bg-white text-teal-700 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all">
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
