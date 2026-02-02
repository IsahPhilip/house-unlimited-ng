
import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { GoogleGenAI, Type } from '@google/genai';
import PropertyDetailsPage from './src/pages/PropertyDetails';

// Declare Leaflet globally to fix type errors
declare const L: any;

// --- Types ---
type Page = 'home' | 'property' | 'blog' | 'about' | 'contact' | 'wishlist' | 'property-details' | 'faq' | 'terms' | 'privacy' | 'agents' | 'blog-details';
type AuthMode = 'signin' | 'signup';
type ViewMode = 'grid' | 'map';

interface User {
  name: string;
  email: string;
}

interface SearchCriteria {
  location: string;
  type: string;
  priceRange: string;
  category: 'buy' | 'rent' | 'all';
}

interface Review {
  id: number;
  propertyId: number;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

interface Property {
  id: number;
  title: string;
  price: string;
  priceValue: number;
  type: string;
  category: 'rent' | 'sale';
  address: string;
  beds: number;
  baths: number;
  sqft: number;
  image: string;
  images?: string[];
  description: string;
  amenities: string[];
  featured?: boolean;
  coordinates: [number, number]; // [lat, lng]
}

interface BlogArticle {
  id: number;
  date: string;
  category: string;
  title: string;
  desc: string;
  content: string;
  author: {
    name: string;
    role: string;
    image: string;
  };
  image: string;
  readTime: string;
}

// --- Mock Data ---
const PROPERTIES: Property[] = [
  { 
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
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Experience luxury living in this spacious 4-bedroom apartment featuring stunning river views. This modern residence offers an open-concept layout with high-end finishes, a gourmet kitchen, and floor-to-ceiling windows that flood the space with natural light.',
    amenities: ['River View', 'Gourmet Kitchen', 'Parking', 'Gym', 'Balcony', 'Smart Home System'],
    coordinates: [39.7392, -104.9903]
  },
  { 
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
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Escape to paradise in this charming Hawaiian villa. Perfect for a cozy getaway or a primary residence, this property boasts incredible sunset views over the Pacific. Authentic tropical architecture meets modern comfort in this uniquely situated home.',
    amenities: ['Ocean View', 'Private Garden', 'Lanai', 'Outdoor Shower', 'Solar Panels'],
    coordinates: [21.3069, -157.8583]
  },
  { 
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
    description: 'Efficient and elegant, Pineview Place is an ideal starter home or investment property. This well-maintained apartment features hardwood floors, updated appliances, and a quiet balcony overlooking the local park.',
    amenities: ['Park View', 'Updated Appliances', 'Security System', 'Laundry In-unit'],
    coordinates: [40.7128, -74.0060]
  },
  { 
    id: 4, 
    title: 'Azure Sky Villa', 
    price: '$8,000/month', 
    priceValue: 8000, 
    type: 'Villa', 
    category: 'rent', 
    address: '2118 Thornridge Cir., Connecticut 35...', 
    beds: 6, 
    baths: 3, 
    sqft: 3000, 
    image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=800',
    description: 'This grand villa in Connecticut offers unparalleled space and privacy. With 6 bedrooms and sprawling living areas, it is the perfect retreat for large families. The property features a private pool and professionally landscaped grounds.',
    amenities: ['Private Pool', 'Landscaped Garden', 'Double Garage', 'Fireplace', 'Wine Cellar'],
    coordinates: [41.6032, -73.0877]
  },
  { 
    id: 5, 
    title: 'MetroView Apartments', 
    price: '$245,000', 
    priceValue: 245000, 
    type: 'Apartment', 
    category: 'sale', 
    address: '2972 Westheimer Rd., Illinois 85486', 
    beds: 3, 
    baths: 2, 
    sqft: 1850, 
    image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=800', 
    featured: true,
    description: 'Live in the heart of the city with these stunning metro views. This 3-bedroom unit combines urban convenience with quiet luxury. Features include a wrap-around balcony and access to building amenities including a rooftop lounge.',
    amenities: ['Rooftop Access', 'City View', '24/7 Doorman', 'Wrap-around Balcony'],
    coordinates: [39.7337, -89.6501]
  },
  { 
    id: 6, 
    title: 'Skyline Oasis Apartments', 
    price: '$315,000', 
    priceValue: 315000, 
    type: 'Apartment', 
    category: 'sale', 
    address: '2715 Ash Dr. San Jose, South Dakota 83475', 
    beds: 4, 
    baths: 3, 
    sqft: 2500, 
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800', 
    featured: true,
    description: 'An oasis in the sky, this top-floor unit offers tranquility and sophistication. Every room is designed with the views in mind. The primary suite features a spa-like bathroom and a private seating area.',
    amenities: ['Spa Bathroom', 'Elevator Access', 'High Ceilings', 'Walk-in Closets'],
    coordinates: [44.3668, -100.3538]
  },
];

const INITIAL_REVIEWS: Review[] = [
  { id: 1, propertyId: 1, userName: 'John Smith', rating: 5, comment: 'Absolutely stunning views and the interior is top-notch.', date: '2024-03-15' },
  { id: 2, propertyId: 1, userName: 'Sarah Jenkins', rating: 4, comment: 'Great location, though parking can be a bit tight during peak hours.', date: '2024-04-02' },
  { id: 3, propertyId: 5, userName: 'Michael Ross', rating: 5, comment: 'Modern, clean, and the rooftop is incredible.', date: '2024-02-20' },
];

const BLOGS: BlogArticle[] = [
  { 
    id: 1, 
    date: '15 May 2024', 
    category: 'Apartment', 
    title: 'Apartment Hunting 101: Finding Your Perfect Space', 
    desc: 'Navigating the rental market can be daunting. We break down everything you need to know from budget planning to signing the lease.', 
    readTime: '6 min read',
    author: {
      name: 'Sarah Montgomery',
      role: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400'
    },
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=600',
    content: `Finding the right apartment is more than just picking a building; it's about finding a sanctuary that matches your lifestyle and budget. In this guide, we explore the essential steps to securing your dream rental.

First, established a clear budget. Experts suggest spending no more than 30% of your gross monthly income on rent. This ensures you have enough left for utilities, groceries, and savings.

Next, prioritize your needs versus wants. Do you absolutely need a second bedroom, or would a home office nook suffice? Is proximity to public transit more important than a private balcony? Making a list helps narrow down options during the search.

When viewing properties, look beyond the surface. Check the water pressure, look for ample power outlets, and visit the neighborhood at different times of day to gauge noise levels. Don't be afraid to ask the landlord about building management and recent maintenance.

Finally, when you find the "one," be prepared to act fast. Have your documentation—proof of income, references, and deposit—ready to go. A well-prepared application can often be the difference between getting the keys or continuing the hunt.`
  },
  { 
    id: 2, 
    date: '14 May 2024', 
    category: 'Villa', 
    title: 'Redefining Luxury: Modern Amenities in Villa Living', 
    desc: 'What does luxury look like in 2024? Explore the high-tech features and architectural trends shaping the modern villa.', 
    readTime: '8 min read',
    author: {
      name: 'David Chen',
      role: 'Head of Real Estate',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400'
    },
    image: 'https://images.unsplash.com/photo-1600585154340-be6199f7a096?auto=format&fit=crop&q=80&w=600',
    content: `Luxury today isn't just about marble floors and gold fixtures; it's about seamless integration of technology and nature. The modern villa is a masterpiece of smart engineering designed to provide ultimate comfort and sustainability.

One major trend is the "Biophilic Design" approach. Architects are now building homes that flow directly into their surroundings. Large glass walls that disappear into the floor, indoor waterfalls, and vertical gardens are becoming standard in high-end villas.

Smart home automation has also reached new heights. Imagine a home that adjusts the lighting based on your circadian rhythm, pre-heats the pool when you're 10 minutes away, and manages its own energy grid through advanced solar and battery systems.

Furthermore, wellness suites are replacing basic gym rooms. Owners are investing in cryotherapy chambers, infra-red saunas, and sound-proof meditation pods. Home offices have also evolved into "Executive command centers" with professional-grade video conferencing equipment and soundproofing.

Living in a villa today means experiencing a tailored environment that anticipates your needs before you even realize them.`
  },
  { 
    id: 3, 
    date: '13 May 2024', 
    category: 'Interior', 
    title: 'Minimalism vs. Maximalism: Which Home Style is for You?', 
    desc: 'Choosing an aesthetic is a personal journey. We compare two of the most popular design philosophies to help you decide.', 
    readTime: '5 min read',
    author: {
      name: 'Michael Smith',
      role: 'Senior Interior Designer',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400'
    },
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=600',
    content: `The age-old debate of "less is more" versus "more is more" continues to shape interior design trends. But which one truly makes a house feel like a home?

Minimalism, popularized by the "Marie Kondo" movement, focuses on simplicity and functionality. It’s about intentional living. A minimalist home often features a neutral palette, clean lines, and hidden storage. The goal is to reduce visual noise and create a sense of calm. Proponents argue that a clutter-free space leads to a clutter-free mind.

On the other end of the spectrum is Maximalism. This is not about mess, but about expression. It’s about bold colors, rich textures, and layers of history. A maximalist home might feature a gallery wall of eccentric art, mismatched vintage furniture, and vibrant patterns. It’s a celebration of personality and curated collections.

Which one should you choose? It often depends on your temperament. If you find peace in order and empty space, minimalism is your ally. If you find inspiration in objects and vivid environments, maximalism will fuel your creativity.

Many modern homeowners are finding a "middle ground," blending the clean foundations of minimalism with the expressive details of maximalism—a style sometimes called 'Minimalist Maximalism'.`
  },
];

const TEAM = [
  { name: 'Sarah Montgomery', role: 'CEO & Founder', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400' },
  { name: 'David Chen', role: 'Head of Real Estate', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400' },
  { name: 'Elena Rodriguez', role: 'Chief Technology Officer', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400' },
  { name: 'Michael Smith', role: 'Senior Interior Designer', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400' },
];

const PRINCIPLES = [
  { title: 'Radical Transparency', desc: 'We provide honest data and clear pricing, ensuring you have all the facts before making a decision.', icon: '👁️' },
  { title: 'AI-Driven Innovation', desc: 'We leverage Gemini AI to visualize possibilities and find matches that traditional search engines miss.', icon: '🤖' },
  { title: 'People First', desc: 'Beyond the tech, our primary focus is the human experience of finding a place to call home.', icon: '🤝' },
  { title: 'Uncompromising Integrity', desc: 'We hold ourselves and our agents to the highest ethical standards in every transaction.', icon: '💎' },
];

const FAQS = [
  { question: 'How do I start the buying process?', answer: 'The first step is to get pre-approved for a mortgage to understand your budget. Then, use our search tools to browse properties and schedule tours with our agents.' },
  { question: 'What are the closing costs?', answer: 'Closing costs typically range from 2% to 5% of the purchase price and include things like title insurance, appraisal fees, and taxes.' },
  { question: 'Can I sell my property on this platform?', answer: 'Yes! Contact one of our senior realtors via the Contact Us page to list your property and leverage our AI marketing tools.' },
  { question: 'How does the AI Dream Home Visualizer work?', answer: 'We use Google Gemini AI to process your text description and generate a high-fidelity image of a potential exterior design for your dream home.' },
];

// --- Utility Functions ---

const handleShare = async (property: Property | BlogArticle) => {
  const isBlog = 'category' in property && !('beds' in property);
  const title = isBlog ? (property as BlogArticle).title : (property as Property).title;
  const text = isBlog ? `Check out this interesting article: ${title}` : `I found this amazing property at ${(property as Property).address} for ${(property as Property).price}. Check it out!`;
  
  const shareData = {
    title: `${title} on Real Estate.`,
    text: text,
    url: `${window.location.origin}${window.location.pathname}?${isBlog ? 'blogId' : 'id'}=${property.id}`
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else if (navigator.clipboard) { // Add this check
      await navigator.clipboard.writeText(shareData.url);
      alert('Link copied to clipboard!');
    } else {
      // Fallback for environments where navigator.clipboard is not available
      // e.g., prompt user to manually copy
      prompt('Copy this link:', shareData.url);
    }
  } catch (err) {
    if ((err as Error).name !== 'AbortError') {
      console.error('Error sharing:', err);
    }
  }
};

// --- Components ---

const MapView = ({ properties, onNavigate }: { properties: Property[], onNavigate: (id: number) => void }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current, {
        center: [39.8283, -98.5795],
        zoom: 4,
        zoomControl: false
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(mapInstance.current);

      L.control.zoom({ position: 'bottomright' }).addTo(mapInstance.current);
      markersRef.current = L.layerGroup().addTo(mapInstance.current);
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (markersRef.current && mapInstance.current) {
      markersRef.current.clearLayers();

      properties.forEach(prop => {
        const customIcon = L.divIcon({
          className: 'custom-div-icon',
          html: `<div class="price-marker">${prop.price.split('/')[0]}</div>`,
          iconSize: [60, 30],
          iconAnchor: [30, 15]
        });

        const marker = L.marker(prop.coordinates, { icon: customIcon });
        
        const popupContent = document.createElement('div');
        popupContent.className = 'w-48 overflow-hidden rounded-xl';
        popupContent.innerHTML = `
          <img src="${prop.image}" class="w-full h-24 object-cover">
          <div class="p-3">
            <h4 class="font-bold text-gray-900 text-sm mb-1">${prop.title}</h4>
            <p class="text-blue-600 font-bold text-xs mb-2">${prop.price}</p>
            <button class="view-details-btn bg-blue-600 text-white w-full py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-blue-700 transition-colors">
              View Details
            </button>
          </div>
        `;

        marker.bindPopup(popupContent);
        
        marker.on('popupopen', () => {
          const btn = popupContent.querySelector('.view-details-btn');
          btn?.addEventListener('click', (e) => {
            e.stopPropagation();
            onNavigate(prop.id);
          });
        });

        markersRef.current?.addLayer(marker);
      });

      if (properties.length > 0) {
        const bounds = L.latLngBounds(properties.map(p => p.coordinates));
        mapInstance.current.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [properties, onNavigate]);

  return <div ref={mapRef} className="w-full h-[600px] rounded-3xl shadow-inner border border-gray-100 z-0" />;
};

const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children?: React.ReactNode }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white rounded-3xl w-full max-w-lg p-8 relative z-10 shadow-2xl animate-in zoom-in duration-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

const AuthModal = ({ isOpen, onClose, mode, setMode }: { 
  isOpen: boolean, 
  onClose: () => void, 
  mode: AuthMode, 
  setMode: (m: AuthMode) => void
}) => {
  const { login, register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (mode === 'signin') {
        await login(email, password);
      } else {
        await register({ name, email, password });
      }
      onClose();
    } catch (err) {
      setError('Invalid credentials or user already exists.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={mode === 'signin' ? 'Sign In' : 'Sign Up'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {mode === 'signup' && (
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Full Name</label>
            <input 
              required 
              type="text" 
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="John Doe" 
              className="w-full bg-gray-50 border-none rounded-xl px-5 py-4 text-sm focus:ring-2 focus:ring-blue-600 outline-none" 
            />
          </div>
        )}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Email Address</label>
          <input 
            required 
            type="email" 
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="example@email.com" 
            className="w-full bg-gray-50 border-none rounded-xl px-5 py-4 text-sm focus:ring-2 focus:ring-blue-600 outline-none" 
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Password</label>
          <input 
            required 
            type="password" 
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••" 
            className="w-full bg-gray-50 border-none rounded-xl px-5 py-4 text-sm focus:ring-2 focus:ring-blue-600 outline-none" 
          />
        </div>
        <button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-200 mt-4"
        >
          {mode === 'signin' ? 'Sign In' : 'Create Account'}
        </button>
        <p className="text-center text-sm text-gray-500 mt-6">
          {mode === 'signin' ? "Don't have an account? " : "Already have an account? "}
          <button 
            type="button"
            onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
            className="text-blue-600 font-bold hover:underline"
          >
            {mode === 'signin' ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </form>
    </Modal>
  );
};

const StarRating = ({ rating, setRating, interactive = false, size = "sm" }: { rating: number, setRating?: (r: number) => void, interactive?: boolean, size?: "sm" | "md" | "lg" }) => {
  const iconSize = size === "lg" ? "w-6 h-6" : size === "md" ? "w-5 h-5" : "w-4 h-4";
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && setRating?.(star)}
          className={`${interactive ? 'hover:scale-110 transition-transform cursor-pointer' : ''} ${star <= rating ? 'text-yellow-400' : 'text-gray-200'}`}
        >
          <svg className={iconSize} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        </button>
      ))}
    </div>
  );
};

const Navbar = ({ 
  currentPage, 
  setCurrentPage, 
  user, 
  openAuthModal, 
  logout,
  wishlistCount
}: { 
  currentPage: Page, 
  setCurrentPage: (p: Page) => void,
  user: User | null,
  openAuthModal: (mode: AuthMode) => void,
  logout: () => void,
  wishlistCount: number
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems: { label: string, page: Page }[] = [
    { label: 'home', page: 'home' },
    { label: 'property', page: 'property' },
    { label: 'blog', page: 'blog' },
    { label: 'About Us', page: 'about' },
    { label: 'Contact Us', page: 'contact' },
  ];

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white sticky top-0 z-40 shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => handleNavigate('home')}>
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-2">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            </div>
            <span className="text-xl font-bold text-gray-900">Real Estate.</span>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => handleNavigate(item.page)}
                className={`capitalize font-medium transition-colors ${currentPage === item.page ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
              >
                {item.label}
              </button>
            ))}
            {user && (
              <button
                onClick={() => handleNavigate('wishlist')}
                className={`capitalize font-medium transition-colors flex items-center ${currentPage === 'wishlist' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
              >
                Wishlist
                {wishlistCount > 0 && (
                  <span className="ml-2 bg-blue-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {wishlistCount}
                  </span>
                )}
              </button>
            )}
          </div>

          {/* Desktop User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">{user.name}</p>
                  <button onClick={logout} className="text-xs text-red-500 hover:underline">Sign Out</button>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center border border-blue-200 shadow-sm">
                  <span className="text-blue-600 font-bold uppercase">{user.name.charAt(0)}</span>
                </div>
              </div>
            ) : (
              <>
                <button onClick={() => openAuthModal('signin')} className="text-gray-600 font-bold hover:text-blue-600 transition-colors text-sm px-4">Sign In</button>
                <button onClick={() => openAuthModal('signup')} className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-blue-700 transition-all text-sm shadow-lg shadow-blue-100">Sign Up</button>
              </>
            )}
          </div>

          {/* Mobile Hamburger Trigger */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            >
              {isMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 animate-in slide-in-from-top duration-300 shadow-xl overflow-hidden">
          <div className="px-4 py-6 space-y-6">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.page}
                  onClick={() => handleNavigate(item.page)}
                  className={`text-left text-lg font-semibold py-2 px-4 rounded-xl transition-colors ${currentPage === item.page ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  {item.label.charAt(0).toUpperCase() + item.label.slice(1)}
                </button>
              ))}
              {user && (
                <button
                  onClick={() => handleNavigate('wishlist')}
                  className={`text-left text-lg font-semibold py-2 px-4 rounded-xl flex items-center justify-between transition-colors ${currentPage === 'wishlist' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  Wishlist
                  {wishlistCount > 0 && (
                    <span className="bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                      {wishlistCount}
                    </span>
                  )}
                </button>
              )}
            </div>
            
            <div className="pt-6 border-t border-gray-100">
              {user ? (
                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => { logout(); setIsMenuOpen(false); }} 
                    className="text-red-500 font-bold text-sm hover:underline"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => { openAuthModal('signin'); setIsMenuOpen(false); }} 
                    className="w-full py-3 px-4 text-center font-bold text-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={() => { openAuthModal('signup'); setIsMenuOpen(false); }} 
                    className="w-full py-3 px-4 text-center font-bold text-white bg-blue-600 rounded-xl shadow-lg shadow-blue-200"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

const Footer = ({ onNavigate }: { onNavigate: (p: Page) => void }) => (
  <footer className="bg-slate-900 text-white pt-16 pb-8">
    <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
      <div className="space-y-4">
        <div className="flex items-center cursor-pointer" onClick={() => onNavigate('home')}>
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center mr-2">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
          </div>
          <span className="text-xl font-bold">Real Estate.</span>
        </div>
        <p className="text-gray-400 text-sm">Empowering home seekers with expert human guidance since 1995.</p>
        <div className="flex space-x-4">
          <div className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors"><i className="fab fa-facebook-f text-xs"></i></div>
          <div className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors"><i className="fab fa-twitter text-xs"></i></div>
          <div className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors"><i className="fab fa-linkedin-in text-xs"></i></div>
        </div>
      </div>
      <div>
        <h4 className="font-bold mb-6">Company</h4>
        <ul className="space-y-3 text-gray-400 text-sm">
          <li className="hover:text-blue-400 cursor-pointer" onClick={() => onNavigate('agents')}>Our Agents</li>
          <li className="hover:text-blue-400 cursor-pointer" onClick={() => onNavigate('faq')}>FAQs</li>
          <li className="hover:text-blue-400 cursor-pointer" onClick={() => onNavigate('home')}>Testimonial</li>
          <li className="hover:text-blue-400 cursor-pointer" onClick={() => onNavigate('about')}>About Us</li>
          <li className="hover:text-blue-400 cursor-pointer" onClick={() => onNavigate('contact')}>Contact Us</li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold mb-6">Contact</h4>
        <ul className="space-y-3 text-gray-400 text-sm">
          <li className="flex items-center"><span className="mr-2 text-blue-500">📞</span> +1 (408) 555-0120</li>
          <li className="flex items-center"><span className="mr-2 text-blue-500">✉️</span> example@gmail.com</li>
          <li className="flex items-center"><span className="mr-2 text-blue-500">📍</span> 2464 Royal Ln. Mesa, New Jersey 45463</li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold mb-6">Get the latest information</h4>
        <div className="relative">
          <input type="email" placeholder="Email address" className="w-full bg-slate-800 border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-600" />
          <button className="absolute right-1 top-1 bottom-1 bg-blue-600 px-3 rounded-md hover:bg-blue-700 transition-colors">➤</button>
        </div>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between text-gray-500 text-xs text-center md:text-left">
      <p>© 2024 Real Estate. All Rights Reserved.</p>
      <div className="space-x-6 mt-4 md:mt-0">
        <span className="hover:text-white cursor-pointer" onClick={() => onNavigate('terms')}>User Terms & Conditions</span>
        <span className="hover:text-white cursor-pointer" onClick={() => onNavigate('privacy')}>Privacy Policy</span>
      </div>
    </div>
  </footer>
);

const FAQPage = () => (
  <div className="py-24 bg-gray-50 min-h-screen animate-in fade-in duration-500">
    <div className="max-w-3xl mx-auto px-4">
      <div className="text-center mb-16">
        <p className="text-blue-600 font-semibold mb-2 uppercase tracking-widest text-xs font-bold">Answers to your questions</p>
        <h1 className="text-4xl font-bold text-gray-900">Frequently Asked <span className="text-gray-400 font-light italic">Questions</span></h1>
      </div>
      <div className="space-y-6">
        {FAQS.map((faq, idx) => (
          <div key={idx} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h4 className="text-lg font-bold text-gray-900 mb-4">{faq.question}</h4>
            <p className="text-gray-500 text-sm leading-relaxed">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const PolicyPage = ({ title, content }: { title: string, content: string[] }) => (
  <div className="py-24 bg-gray-50 min-h-screen animate-in fade-in duration-500">
    <div className="max-w-4xl mx-auto px-4">
      <h1 className="text-4xl font-bold text-gray-900 mb-12">{title}</h1>
      <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 space-y-8">
        {content.map((p, i) => (
          <p key={i} className="text-gray-600 text-sm leading-relaxed">{p}</p>
        ))}
      </div>
    </div>
  </div>
);

const AgentsPage = () => (
  <div className="py-24 bg-gray-50 min-h-screen animate-in fade-in duration-500">
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-16">
        <p className="text-blue-600 font-semibold mb-2 uppercase tracking-widest text-xs font-bold">Meet our experts</p>
        <h1 className="text-4xl font-bold text-gray-900">Our Professional <span className="text-gray-400 font-light italic">Agents</span></h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {TEAM.map((member, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 text-center hover:shadow-xl transition-all group">
            <img src={member.image} alt={member.name} className="w-32 h-32 rounded-full mx-auto mb-6 object-cover border-4 border-blue-50" />
            <h4 className="text-xl font-bold text-gray-900">{member.name}</h4>
            <p className="text-blue-600 text-xs font-bold uppercase tracking-widest mt-1 mb-6">{member.role}</p>
            <div className="flex justify-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer"><i className="fab fa-facebook-f text-xs"></i></div>
              <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer"><i className="fab fa-twitter text-xs"></i></div>
              <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer"><i className="fab fa-linkedin-in text-xs"></i></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const BlogDetailsPage = ({ blogId, onNavigate }: { blogId: number, onNavigate: (p: Page, id?: number) => void }) => {
  const blog = BLOGS.find(b => b.id === blogId);
  if (!blog) return <div className="p-20 text-center">Article not found.</div>;

  const relatedBlogs = BLOGS.filter(b => b.id !== blogId).slice(0, 3);

  return (
    <div className="bg-white min-h-screen animate-in fade-in duration-500">
      {/* Article Hero */}
      <div className="relative h-[400px] md:h-[500px]">
        <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="max-w-4xl px-4 text-center">
            <span className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 inline-block shadow-lg">
              {blog.category}
            </span>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight drop-shadow-lg">
              {blog.title}
            </h1>
            <div className="mt-8 flex items-center justify-center space-x-4 text-white/90">
              <div className="flex items-center space-x-2">
                <img src={blog.author.image} className="w-8 h-8 rounded-full border-2 border-white/20" />
                <span className="font-bold text-sm">{blog.author.name}</span>
              </div>
              <span className="text-white/40">•</span>
              <span className="text-sm font-medium">{blog.date}</span>
              <span className="text-white/40">•</span>
              <span className="text-sm font-medium">{blog.readTime}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-4 gap-16">
        {/* Social Share Sidebar */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-32 space-y-8">
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-6">Share Article</h4>
              <div className="flex flex-col space-y-4">
                <button onClick={() => handleShare(blog)} className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                  <i className="fab fa-facebook-f"></i>
                </button>
                <button onClick={() => handleShare(blog)} className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-blue-400 hover:text-white transition-all shadow-sm">
                  <i className="fab fa-twitter"></i>
                </button>
                <button onClick={() => handleShare(blog)} className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-blue-700 hover:text-white transition-all shadow-sm">
                  <i className="fab fa-linkedin-in"></i>
                </button>
                <button onClick={() => handleShare(blog)} className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                  <i className="fas fa-link"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-2">
          <article className="prose prose-lg prose-slate max-w-none">
            {blog.content.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="text-gray-600 text-lg leading-relaxed mb-8">
                {paragraph}
              </p>
            ))}
          </article>

          {/* Author Bio */}
          <div className="mt-16 pt-12 border-t border-gray-100">
            <div className="bg-gray-50 p-8 rounded-3xl flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
              <img src={blog.author.image} className="w-24 h-24 rounded-3xl object-cover shadow-xl" />
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-1">{blog.author.name}</h4>
                <p className="text-blue-600 text-xs font-bold uppercase tracking-widest mb-3">{blog.author.role}</p>
                <p className="text-gray-500 text-sm leading-relaxed italic">
                  Passionate about connecting people with their ideal living spaces. Sarah has over 15 years of experience in the luxury real estate sector.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar / Related */}
        <div className="lg:col-span-1">
          <div className="sticky top-32">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-8">Related Articles</h4>
            <div className="space-y-8">
              {relatedBlogs.map(rb => (
                <div key={rb.id} className="group cursor-pointer" onClick={() => onNavigate('blog-details', rb.id)}>
                  <div className="aspect-video rounded-2xl overflow-hidden mb-4 shadow-sm">
                    <img src={rb.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <h5 className="font-bold text-gray-900 text-sm leading-snug group-hover:text-blue-600 transition-colors">
                    {rb.title}
                  </h5>
                  <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-wider">{rb.date}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 bg-blue-600 rounded-3xl p-8 text-white">
              <h4 className="text-lg font-bold mb-4">Want more insights?</h4>
              <p className="text-blue-100 text-xs leading-relaxed mb-6">Join 50,000+ home buyers receiving our weekly market reports and design tips.</p>
              <input placeholder="Email address" className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-xs text-white placeholder:text-blue-200 focus:ring-2 focus:ring-white outline-none mb-3" />
              <button className="w-full bg-white text-blue-600 py-3 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg">Subscribe</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PropertyCard: React.FC<{ 
  property: Property, 
  isWishlisted: boolean, 
  onWishlistToggle: (id: number) => void,
  onNavigate: (id: number) => void
}> = ({ property, isWishlisted, onWishlistToggle, onNavigate }) => (
  <div 
    onClick={() => onNavigate(property.id)}
    className="bg-white rounded-2xl overflow-hidden shadow-md group transition-all hover:shadow-xl border border-gray-100 cursor-pointer"
  >
    <div className="relative aspect-[4/3] overflow-hidden">
      <img src={property.image} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      <div className="absolute top-4 left-4 flex space-x-2">
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${property.category === 'rent' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800'}`}>
          For {property.category === 'rent' ? 'Rent' : 'Sale'}
        </span>
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">{property.type}</span>
      </div>
      <div className="absolute top-4 right-4 flex flex-col space-y-2">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onWishlistToggle(property.id);
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
            handleShare(property);
          }}
          className="bg-white/80 backdrop-blur p-2 rounded-full transition-all shadow-lg text-gray-600 hover:bg-blue-600 hover:text-white"
          title="Share property"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
          </svg>
        </button>
      </div>
    </div>
    <div className="p-5">
      <p className="text-blue-600 font-bold text-lg mb-1">{property.price}</p>
      <h3 className="font-bold text-gray-900 mb-2 truncate group-hover:text-blue-600 transition-colors">{property.title}</h3>
      <p className="text-gray-500 text-sm mb-4 flex items-center">
        <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
        {property.address}
      </p>
      <div className="flex justify-between items-center text-gray-600 text-xs font-medium border-t pt-4">
        <span className="flex items-center"><span className="mr-1 text-blue-500">🛏️</span> {property.beds} Beds</span>
        <span className="flex items-center"><span className="mr-1 text-blue-500">🚿</span> {property.baths} Bath</span>
        <span className="flex items-center"><span className="mr-1 text-blue-500">📐</span> {property.sqft} sqft</span>
      </div>
    </div>
  </div>
);

// --- Pages ---

const Home = ({ 
  onSearch, 
  wishlistIds, 
  onWishlistToggle,
  onNavigate
}: { 
  onSearch: (criteria: SearchCriteria) => void, 
  wishlistIds: number[], 
  onWishlistToggle: (id: number) => void,
  onNavigate: (id: number) => void
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
          {PROPERTIES.slice(0, 6).map((p, i) => (
            <PropertyCard 
              key={p.id} 
              property={p} 
              isWishlisted={wishlistIds.includes(p.id)}
              onWishlistToggle={onWishlistToggle}
              onNavigate={onNavigate}
            />
          ))}
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
            { name: 'Jenny Wilson', img: 'https://i.pravatar.cc/150?u=jenny', text: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa.' },
            { name: 'Esther Howard', img: 'https://i.pravatar.cc/150?u=esther', text: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa.' }
          ].map((t, i) => (
            <div key={i} className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 flex items-start space-x-6">
              <img src={t.img} alt={t.name} className="w-20 h-20 rounded-full border-4 border-blue-50 object-cover" />
              <div className="flex-1">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h4 className="font-bold text-gray-900">{t.name}</h4>
                    <p className="text-gray-400 text-sm">Customer</p>
                  </div>
                  <div className="text-blue-200 text-6xl font-serif h-10 overflow-hidden leading-[1]">“</div>
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
    </div>
  );
};

const PropertyPage = ({ 
  searchCriteria, 
  wishlistIds, 
  onWishlistToggle,
  onNavigate
}: { 
  searchCriteria: SearchCriteria | null, 
  wishlistIds: number[], 
  onWishlistToggle: (id: number) => void,
  onNavigate: (id: number) => void
}) => {
  const [filter, setFilter] = useState<'all' | 'rent' | 'sale'>(searchCriteria?.category === 'buy' ? 'sale' : searchCriteria?.category === 'rent' ? 'rent' : 'all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [dreamHousePrompt, setDreamHousePrompt] = useState('');
  const [generatedHouse, setGeneratedHouse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
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

  const handleGenerate = async () => {
    if (!dreamHousePrompt) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: `A photorealistic modern luxury real estate exterior: ${dreamHousePrompt}` }] },
        config: { imageConfig: { aspectRatio: "16:9" } }
      });
      
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            setGeneratedHouse(`data:image/png;base64,${part.inlineData.data}`);
            break;
          }
        }
      }
    } catch (e) {
      console.error(e);
      alert('Failed to visualize. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

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

        {/* AI Dream Home Feature */}
        <div className="mt-24 bg-slate-900 rounded-3xl p-12 text-white overflow-hidden relative shadow-2xl border border-white/5">
          <div className="max-w-3xl relative z-10">
            <h2 className="text-3xl font-bold mb-4">AI Dream Home Visualizer</h2>
            <p className="text-gray-400 mb-8 text-sm leading-relaxed">Can't find what you're looking for? Describe your perfect home and our Gemini AI will visualize it for you instantly. Let your imagination run wild!</p>
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <input 
                value={dreamHousePrompt}
                onChange={e => setDreamHousePrompt(e.target.value)}
                placeholder="e.g. A minimalist glass villa on a cliff in Norway..." 
                className="flex-1 bg-slate-800 border border-white/10 rounded-xl px-6 py-4 text-white focus:ring-2 focus:ring-blue-600 outline-none placeholder:text-gray-600 transition-all"
              />
              <button 
                onClick={handleGenerate}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-xl font-bold transition-all disabled:opacity-50 flex items-center justify-center min-w-[150px] shadow-lg shadow-blue-600/20"
              >
                {loading ? <span className="flex items-center"><svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Generating...</span> : 'Visualize'}
              </button>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none bg-gradient-to-l from-blue-600 to-transparent"></div>
          {generatedHouse && (
            <div className="mt-8 animate-in zoom-in duration-500 relative z-10">
              <img src={generatedHouse} alt="AI Generated House" className="w-full rounded-2xl shadow-2xl border-4 border-slate-800" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

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
          <p className="text-blue-600 font-semibold mb-2 uppercase tracking-widest text-xs font-bold">Your Saved Items</p>
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
            <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">❤️</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">Start saving your favorite properties to keep track of them and get updates on price changes.</p>
            <button 
              onClick={() => setCurrentPage('property')}
              className="bg-blue-600 text-white px-10 py-4 rounded-xl font-bold shadow-lg shadow-blue-200 hover:shadow-blue-300 transition-all uppercase tracking-widest text-xs"
            >
              Explore Properties
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const BlogPage = ({ onNavigate }: { onNavigate: (p: Page, id?: number) => void }) => (
  <div className="py-24 bg-gray-50 min-h-screen animate-in fade-in duration-500">
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-16">
        <p className="text-blue-600 font-semibold mb-2 uppercase tracking-widest text-xs font-bold">Latest Updates</p>
        <h1 className="text-4xl font-bold text-gray-900">Industry Insights & <span className="text-gray-400 font-light italic">News</span></h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {BLOGS.map((blog, idx) => (
          <div key={idx} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 group hover:shadow-xl transition-all cursor-pointer" onClick={() => onNavigate('blog-details', blog.id)}>
            <div className="relative aspect-video overflow-hidden">
              <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute top-4 left-4 bg-blue-600 text-white px-4 py-1.5 rounded-full text-[10px] font-bold shadow-md">{blog.date}</div>
            </div>
            <div className="p-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-blue-600 font-bold text-xs uppercase tracking-wider">{blog.category}</span>
                <span className="text-gray-400 text-[10px] font-medium uppercase">{blog.readTime}</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">{blog.title}</h3>
              <p className="text-gray-500 text-xs mb-6 line-clamp-3 leading-relaxed">{blog.desc}</p>
              <button className="text-gray-900 font-bold text-sm flex items-center group-hover:translate-x-1 transition-transform">Read More <span className="ml-2 text-blue-600">→</span></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const AboutPage = () => (
  <div className="animate-in fade-in duration-500">
    {/* Hero / Story Section */}
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
           <p className="text-blue-600 font-semibold mb-2 uppercase tracking-widest text-xs font-bold">Our Story</p>
           <h1 className="text-5xl font-bold text-gray-900 mb-8 leading-tight">We help you find your <span className="text-blue-600">Perfect Home</span> since 1995.</h1>
           <p className="text-gray-600 mb-8 leading-relaxed text-sm">Founded in Los Angeles, Real Estate. has grown from a small family firm into a global leader in property management and brokerage. We believe everyone deserves a place they can truly call home, and we leverage the latest technology—including Gemini AI—to make that process as smooth as possible.</p>
           <div className="grid grid-cols-3 gap-8 mb-10">
              <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                <p className="text-3xl font-bold text-blue-600 mb-1">25+</p>
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Years Exp</p>
              </div>
              <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                <p className="text-3xl font-bold text-blue-600 mb-1">10k+</p>
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Sales</p>
              </div>
              <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                <p className="text-3xl font-bold text-blue-600 mb-1">500+</p>
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Agents</p>
              </div>
           </div>
           <button className="bg-blue-600 text-white px-10 py-4 rounded-full font-bold shadow-lg shadow-blue-200 hover:shadow-blue-300 transition-all text-sm uppercase tracking-widest">Download Brochure</button>
        </div>
        <div className="relative">
          <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800" className="rounded-3xl shadow-2xl relative z-10 w-full object-cover h-[500px]" alt="Modern Office" />
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-blue-100 rounded-full -z-0"></div>
          <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-blue-600/10 rounded-3xl -z-0"></div>
          <div className="absolute bottom-10 right-10 bg-white p-6 rounded-2xl shadow-xl z-20">
             <p className="text-blue-600 font-bold text-2xl">99%</p>
             <p className="text-gray-400 text-[10px] font-bold uppercase">Customer Satisfaction</p>
          </div>
        </div>
      </div>
    </section>

    {/* Purpose & Principles Section */}
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-blue-600 font-semibold mb-2 uppercase tracking-widest text-xs font-bold">Our Philosophy</p>
          <h2 className="text-4xl font-bold text-gray-900">Purpose & <span className="text-gray-400 font-light italic">Principles</span></h2>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto">We are guided by a simple mission: to simplify the complex world of real estate through technology and human-centric design.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {PRINCIPLES.map((p, idx) => (
            <div key={idx} className="p-10 rounded-3xl bg-gray-50 border border-transparent hover:border-blue-100 hover:bg-white hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm group-hover:scale-110 transition-transform">{p.icon}</div>
              <h4 className="text-xl font-bold text-gray-900 mb-4">{p.title}</h4>
              <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Meet the Team Section */}
    <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-xl">
            <p className="text-blue-400 font-semibold mb-2 uppercase tracking-widest text-xs font-bold">The Brains Behind the Brand</p>
            <h2 className="text-4xl font-bold">Meet our <span className="text-blue-400 italic">Visionary</span> Team</h2>
          </div>
          <button className="text-blue-400 font-bold hover:underline flex items-center">Join our growing team <span className="ml-2">→</span></button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {TEAM.map((member, idx) => (
            <div key={idx} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-3xl aspect-[4/5] mb-6">
                <img src={member.image} alt={member.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute bottom-6 left-6 right-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 opacity-0 group-hover:opacity-100 flex space-x-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs"><i className="fab fa-linkedin-in"></i></div>
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-xs"><i className="fab fa-twitter"></i></div>
                </div>
              </div>
              <h4 className="text-xl font-bold group-hover:text-blue-400 transition-colors">{member.name}</h4>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-600/5 -skew-x-12 translate-x-1/2"></div>
    </section>
  </div>
);

const ContactPage = () => (
  <div className="py-24 bg-gray-50 min-h-screen animate-in fade-in duration-500">
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-16">
        <p className="text-blue-600 font-semibold mb-2 uppercase tracking-widest text-xs font-bold">Get In Touch</p>
        <h1 className="text-4xl font-bold text-gray-900">Contact <span className="text-gray-400 font-light italic">Us</span></h1>
        <p className="text-gray-500 mt-4 max-w-2xl mx-auto">Have questions about a property or want to list your own? Our team is here to help you every step of the way.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-xl">📞</div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Phone Number</p>
                <p className="font-bold text-gray-900">+1 (408) 555-0120</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-xl">✉️</div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email Address</p>
                <p className="font-bold text-gray-900">example@gmail.com</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-xl">📍</div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Office Location</p>
                <p className="font-bold text-gray-900 text-sm">2464 Royal Ln. Mesa, New Jersey 45463</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 p-8 rounded-3xl text-white">
            <h4 className="font-bold mb-4">Working Hours</h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-gray-400">Monday - Friday</span>
                <span className="font-bold">09 AM - 06 PM</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-gray-400">Saturday</span>
                <span className="font-bold">10 AM - 04 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Sunday</span>
                <span className="font-bold text-blue-400">Closed</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Send us a Message</h3>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Full Name</label>
                <input type="text" placeholder="Your name" className="w-full bg-gray-50 border-none rounded-xl px-6 py-4 text-sm focus:ring-2 focus:ring-blue-600 outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Email Address</label>
                <input type="email" placeholder="example@email.com" className="w-full bg-gray-50 border-none rounded-xl px-6 py-4 text-sm focus:ring-2 focus:ring-blue-600 outline-none" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Subject</label>
                <input type="text" placeholder="How can we help?" className="w-full bg-gray-50 border-none rounded-xl px-6 py-4 text-sm focus:ring-2 focus:ring-blue-600 outline-none" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Message</label>
                <textarea rows={6} placeholder="Write your message here..." className="w-full bg-gray-50 border-none rounded-xl px-6 py-4 text-sm focus:ring-2 focus:ring-blue-600 outline-none resize-none"></textarea>
              </div>
              <div className="md:col-span-2">
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-200 uppercase tracking-widest text-xs">
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// --- App Container ---

const App = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const { user, login, logout, register } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('signin');
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria | null>(null);
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);
  const [selectedBlogId, setSelectedBlogId] = useState<number | null>(null);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage, selectedBlogId]);

  // Handle URL query for direct property links
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const blogId = params.get('blogId');
    if (id) {
      const propertyId = parseInt(id);
      if (PROPERTIES.some(p => p.id === propertyId)) {
        setSelectedPropertyId(propertyId);
        setCurrentPage('property-details');
      }
    } else if (blogId) {
      const bId = parseInt(blogId);
      if (BLOGS.some(b => b.id === bId)) {
        setSelectedBlogId(bId);
        setCurrentPage('blog-details');
      }
    }
  }, []);

  const handleSearch = (criteria: SearchCriteria) => {
    setSearchCriteria(criteria);
    setCurrentPage('property');
  };

  const openAuthModal = (mode: AuthMode) => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleWishlistToggle = (id: number) => {
    if (!user) {
      openAuthModal('signin');
      return;
    }
    
    setWishlistIds(prev => 
      prev.includes(id) ? prev.filter(wishId => wishId !== id) : [...prev, id]
    );
  };

  const handleAddReview = (reviewData: Omit<Review, 'id' | 'date'>) => {
    const newReview: Review = {
      ...reviewData,
      id: Date.now(),
      date: new Date().toISOString().split('T')[0]
    };
    setReviews(prev => [newReview, ...prev]);
  };

  const navigateToProperty = (id: number) => {
    setSelectedPropertyId(id);
    setCurrentPage('property-details');
  };

  const handleNavigateToBlog = (page: Page, id?: number) => {
    if (id) setSelectedBlogId(id);
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch(currentPage) {
      case 'home': return <Home onSearch={handleSearch} wishlistIds={wishlistIds} onWishlistToggle={handleWishlistToggle} onNavigate={navigateToProperty} />;
      case 'property': return <PropertyPage searchCriteria={searchCriteria} wishlistIds={wishlistIds} onWishlistToggle={handleWishlistToggle} onNavigate={navigateToProperty} />;
      case 'blog': return <BlogPage onNavigate={handleNavigateToBlog} />;
      case 'blog-details': 
        return selectedBlogId ? (
          <BlogDetailsPage blogId={selectedBlogId} onNavigate={handleNavigateToBlog} />
        ) : (
          <BlogPage onNavigate={handleNavigateToBlog} />
        );
      case 'about': return <AboutPage />;
      case 'contact': return <ContactPage />;
      case 'agents': return <AgentsPage />;
      case 'faq': return <FAQPage />;
      case 'terms': return <PolicyPage title="Terms & Conditions" content={[
        "Welcome to Real Estate. By accessing this platform, you agree to comply with and be bound by the following terms and conditions. If you do not agree, please do not use our services.",
        "Our services provided through the platform, including property searches and AI visualizers, are for informational purposes. While we strive for accuracy, users must verify all details independently.",
        "User accounts are personal and should not be shared. You are responsible for maintaining the confidentiality of your sign-in credentials.",
        "All content, including images generated by our AI tools, is property of Real Estate or its licensors. Unauthorized commercial use is strictly prohibited."
      ]} />;
      case 'privacy': return <PolicyPage title="Privacy Policy" content={[
        "Your privacy is important to us. This policy outlines how we collect, use, and safeguard your personal information when you use our platform.",
        "We collect information such as your name, email address, and property preferences when you create an account or inquire about a listing.",
        "Your data is used to provide personalized property recommendations, facilitate communication with agents, and improve our services.",
        "We do not sell your personal data to third parties. We use industry-standard encryption to protect your sensitive information."
      ]} />;
      case 'wishlist': return <WishlistPage wishlistIds={wishlistIds} onWishlistToggle={handleWishlistToggle} setCurrentPage={setCurrentPage} onNavigate={navigateToProperty} />;
      case 'property-details': 
        return selectedPropertyId ? (
          <PropertyDetailsPage 
            property={PROPERTIES.find(p => p.id === selectedPropertyId)}
            reviews={reviews}
            user={user}
            onAddReview={handleAddReview}
            onWishlistToggle={handleWishlistToggle}
            isWishlisted={wishlistIds.includes(selectedPropertyId)}
            onBack={() => setCurrentPage('property')}
            openAuthModal={openAuthModal}
          />
        ) : (
          <Home onSearch={handleSearch} wishlistIds={wishlistIds} onWishlistToggle={handleWishlistToggle} onNavigate={navigateToProperty} />
        );
      default: return <Home onSearch={handleSearch} wishlistIds={wishlistIds} onWishlistToggle={handleWishlistToggle} onNavigate={navigateToProperty} />;
    }
  };

  return (
    <div className="font-['Inter'] text-gray-900 bg-white antialiased">
      <div className="bg-slate-900 text-white py-2 text-[10px] uppercase tracking-widest font-bold">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex space-x-6">
            <span className="flex items-center"><i className="fas fa-phone mr-2 text-blue-500"></i> (408) 555-0120</span>
            <span className="flex items-center"><i className="fas fa-envelope mr-2 text-blue-500"></i> example@gmail.com</span>
          </div>
          <div className="flex space-x-4">
            <i className="fab fa-facebook-f hover:text-blue-500 cursor-pointer transition-colors"></i>
            <i className="fab fa-twitter hover:text-blue-500 cursor-pointer transition-colors"></i>
            <i className="fab fa-instagram hover:text-blue-500 cursor-pointer transition-colors"></i>
            <i className="fab fa-linkedin hover:text-blue-500 cursor-pointer transition-colors"></i>
          </div>
        </div>
      </div>
      
      <Navbar 
        currentPage={currentPage} 
        setCurrentPage={(p) => { 
          if(p !== 'property' && p !== 'wishlist' && p !== 'property-details' && p !== 'blog-details') {
            setSearchCriteria(null);
            // Clean up URL if we navigate away
            if (window.location.search.includes('id=') || window.location.search.includes('blogId=')) {
              window.history.pushState({}, '', window.location.pathname);
            }
          }
          setCurrentPage(p); 
        }} 
        user={user}
        openAuthModal={openAuthModal}
        logout={logout}
        wishlistCount={wishlistIds.length}
      />
      
      {renderPage()}
      
      <Footer onNavigate={setCurrentPage} />
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        mode={authMode} 
        setMode={setAuthMode}
      />
    </div>
  );
};

// --- Initialization ---
const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
