import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Bath,
  Bed,
  Calendar,
  Car,
  Check,
  Heart,
  Home as HomeIcon,
  Mail,
  MapPin,
  MessageCircle,
  PhoneCall,
  Printer,
  Ruler,
  School,
  Share2,
  Star,
  Video,
  X,
  Zap,
} from 'lucide-react';
import { getPropertyById, getReviewsByPropertyId, addReview } from '../services/api';

// Minimal types needed for this component
type AuthMode = 'signin' | 'signup';

interface User {
  name: string;
  email: string;
}

interface Review {
  id: string;
  propertyId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

interface Property {
  id: string;
  title: string;
  price: string;
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
  virtualTourUrl?: string;
  // New features
  yearBuilt?: number;
  lotSize?: string;
  parkingSpaces?: number;
  utilities?: string[];
  status?: 'available' | 'pending' | 'sold';
  daysOnMarket?: number;
  priceHistory?: { date: string; price: string }[];
  videoTourUrl?: string;
  latitude?: number;
  longitude?: number;
  neighborhood?: {
    name: string;
    schools?: string[];
    crimeRate?: string;
    averagePrice?: string;
  };
  similarProperties?: Property[];
}


// Reusable Star Rating Component
const StarRating = ({ 
  rating, 
  setRating, 
  interactive = false, 
  size = "sm" 
}: { 
  rating: number; 
  setRating?: (r: number) => void; 
  interactive?: boolean; 
  size?: "sm" | "md" | "lg"; 
}) => {
  const iconSize = size === "lg" ? "w-7 h-7" : size === "md" ? "w-6 h-6" : "w-5 h-5";
  
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && setRating?.(star)}
          className={`transition-all ${interactive ? 'hover:scale-110 cursor-pointer' : ''} ${star <= rating ? 'text-yellow-400' : 'text-gray-200'}`}
        >
          <Star className={iconSize} fill={star <= rating ? 'currentColor' : 'none'} />
        </button>
      ))}
    </div>
  );
};

interface PropertyDetailsPageProps {
  propertyId?: string;
  user?: User | null;
  onWishlistToggle?: (id: string, property?: any) => void;
  isWishlisted?: boolean;
  onBack?: () => void;
  openAuthModal?: (mode: AuthMode) => void;
}

const PropertyDetailsPage: React.FC<PropertyDetailsPageProps> = ({
  user = null,
  onWishlistToggle,
  isWishlisted = false,
  onBack,
  openAuthModal,
  propertyId,
}) => {
  const [property, setProperty] = useState<Property | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  const [inquirySent, setInquirySent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isVirtualTourModalOpen, setIsVirtualTourModalOpen] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  
  // Review form
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const loadDetails = async () => {
      if (!propertyId) {
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        const [propertyData, reviewData] = await Promise.all([
          getPropertyById(propertyId.toString()),
          getReviewsByPropertyId(propertyId.toString()),
        ]);
        if (propertyData) {
          setProperty({
            ...propertyData,
            image: (propertyData as any).featuredImage || (propertyData as any).image || (propertyData as any).images?.[0] || '',
          } as any);
          setActiveImage((propertyData as any).featuredImage || (propertyData as any).image || (propertyData as any).images?.[0] || '');
        }
        setReviews(reviewData || []);
      } catch (error) {
        console.error('Failed to load property details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDetails();
  }, [propertyId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center text-gray-600">Loading property...</div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center text-gray-600">Property not found.</div>
      </div>
    );
  }

  const propertyReviews = reviews.map((r: any) => ({
    id: r._id || r.id,
    propertyId: r.property?._id || r.propertyId,
    userName: r.user?.name || r.userName || 'User',
    rating: r.rating,
    comment: r.comment,
    date: r.createdAt || r.date,
  })).filter((r: any) => r.propertyId === property.id);
  const avgRating = propertyReviews.length > 0 
    ? (propertyReviews.reduce((sum, r) => sum + r.rating, 0) / propertyReviews.length).toFixed(1)
    : "0.0";
  const galleryImages = [property.image, ...(property.images || [])].filter(Boolean);
  const primaryImage = activeImage || galleryImages[0] || property.image;

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  const goNextLightbox = () => {
    if (!galleryImages.length) return;
    setLightboxIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const goPrevLightbox = () => {
    if (!galleryImages.length) return;
    setLightboxIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: `Check out this property: ${property.title}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsApp = () => {
    const text = `Check out this property: ${property.title} - ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleEmail = () => {
    const subject = `Check out this property: ${property.title}`;
    const body = `I found this property and thought you might like it: ${window.location.href}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleCall = () => {
    window.location.href = 'tel:+15551234567';
  };

  const handleScheduleViewing = () => {
    const inquiryForm = document.getElementById('inquiry-form');
    if (inquiryForm) {
      inquiryForm.scrollIntoView({ behavior: 'smooth' });
      const firstInput = inquiryForm.querySelector('input');
      if (firstInput) (firstInput as HTMLElement).focus();
    }
  };

  const handleInquiry = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const inquiryData = {
      propertyId: property.id,
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inquiryData),
      });

      if (response.ok) setInquirySent(true);
      else alert('Failed to send inquiry. Please try again.');
    } catch (error) {
      console.error('Error sending inquiry:', error);
      alert('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      await addReview({
        propertyId: property.id,
        rating: newRating,
        comment: newComment,
        title: 'Review',
        userName: user.name,
      } as any);
      const updatedReviews = await getReviewsByPropertyId(property.id);
      setReviews(updatedReviews || []);
      setNewComment('');
      setNewRating(5);
    } catch (error) {
      console.error('Failed to submit review:', error);
      alert('Failed to submit review. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-slate-50">
      {/* Breadcrumbs */}
      <div className="bg-white/80 backdrop-blur border-b border-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <button 
              onClick={onBack}
              className="hover:text-teal-600 transition-colors font-medium"
            >
              <span className="inline-flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Back to Properties
              </span>
            </button>
            <span className="text-gray-300">/</span>
            <span className="font-medium text-gray-900 truncate max-w-[300px]">
              {property.title}
            </span>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-14 space-y-10">
        {/* Gallery (Top) */}
        <section className="bg-white rounded-[28px] border border-white/80 shadow-[0_25px_80px_-55px_rgba(15,23,42,0.8)] overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-2 p-2">
            <button
              onClick={() => openLightbox(galleryImages.findIndex((img) => img === primaryImage) || 0)}
              className="relative aspect-[16/11] md:aspect-[16/10] rounded-2xl overflow-hidden"
            >
              <img src={primaryImage} alt={property.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent"></div>
            </button>
            <div className="grid grid-cols-2 gap-2">
              {galleryImages.slice(1, 5).map((img, i) => (
                <button
                  key={i}
                  onClick={() => openLightbox(i + 1)}
                  className={`relative aspect-[1/1] rounded-2xl overflow-hidden border-2 transition-all ${
                    activeImage === img
                      ? 'border-teal-600'
                      : 'border-transparent hover:border-slate-200'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
          {galleryImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto px-4 pb-4 pt-2">
              {galleryImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => openLightbox(i)}
                  className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                    activeImage === img
                      ? 'border-teal-600 shadow-sm'
                      : 'border-transparent hover:border-slate-200'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Hero Summary */}
        <section className="bg-white rounded-[32px] border border-white/80 shadow-[0_25px_80px_-55px_rgba(15,23,42,0.8)] p-6 md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="min-w-[260px]">
              <div className="flex flex-wrap gap-3 mb-4">
                <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-teal-100 text-teal-800">
                  For Sale
                </span>
                <span className="px-4 py-1.5 bg-white text-slate-700 rounded-full text-xs font-semibold border border-slate-200">
                  {property.type}
                </span>
                {property.status && (
                  <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold ${
                    property.status === 'available'
                      ? 'bg-lime-100 text-lime-800'
                      : property.status === 'pending'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {property.status.toUpperCase()}
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-slate-950 tracking-tight mb-3">
                {property.title}
              </h1>
              <p className="text-slate-700 flex items-center text-lg">
                <MapPin className="w-4 h-4 mr-2 text-teal-600" />
                {property.address}
              </p>
              {property.daysOnMarket && (
                <p className="text-sm text-slate-500 mt-2">
                  {property.daysOnMarket} days on market
                </p>
              )}
            </div>
            <div className="ml-auto text-right">
              <div className="mt-4 flex items-center justify-end gap-2">
                <StarRating rating={parseFloat(avgRating)} size="md" />
                <span className="font-bold text-lg">{avgRating}</span>
                <span className="text-slate-500 text-sm">({propertyReviews.length})</span>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
                <button onClick={handleShare} className="inline-flex items-center gap-2 px-3 py-2 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-700 transition-colors">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
                <button onClick={handleWhatsApp} className="inline-flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </button>
                <button onClick={handleEmail} className="inline-flex items-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-200 transition-colors">
                  <Mail className="w-4 h-4" />
                  Email
                </button>
                {onWishlistToggle && (
                  <button
                    onClick={() => onWishlistToggle(property.id, property)}
                    className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                      isWishlisted
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-slate-100 text-slate-700 hover:text-rose-600'
                    }`}
                  >
                    <Heart className="w-4 h-4" fill={isWishlisted ? 'currentColor' : 'none'} />
                    Wish
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
            {[
              { icon: Bed, label: 'Bedrooms', value: property.beds },
              { icon: Bath, label: 'Bathrooms', value: property.baths },
              { icon: Ruler, label: 'Sqft', value: property.sqft },
              { icon: HomeIcon, label: 'Type', value: property.type },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="bg-slate-50 rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-white text-teal-600 flex items-center justify-center shadow-sm">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-slate-950">{item.value}</div>
                    <div className="text-xs text-slate-500">{item.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">

            {/* Overview */}
            <section className="bg-white p-6 md:p-8 rounded-[28px] shadow-[0_25px_80px_-55px_rgba(15,23,42,0.8)] border border-white/80">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-2xl font-bold">Overview</h2>
                {property.virtualTourUrl && (
                  <button
                    onClick={() => setIsVirtualTourModalOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-700 text-sm font-semibold hover:bg-teal-50 hover:text-teal-700 transition-colors"
                  >
                    <Video className="w-4 h-4" />
                    Virtual Tour
                  </button>
                )}
              </div>
              <p className="text-slate-700 leading-relaxed text-lg whitespace-pre-line">
                {property.description}
              </p>
            </section>

            {/* Amenities */}
            <section className="bg-white p-6 md:p-8 rounded-[28px] shadow-[0_25px_80px_-55px_rgba(15,23,42,0.8)] border border-white/80">
              <h2 className="text-2xl font-bold mb-6">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                {property.amenities.map((amenity, i) => (
                  <div 
                    key={i} 
                    className="flex items-center gap-3 p-3 bg-gradient-to-r from-teal-50 to-slate-50 rounded-xl"
                  >
                    <div className="text-teal-600">
                      <Check className="w-5 h-5" />
                    </div>
                    <span className="font-medium">{amenity}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Property Specifications */}
            <section className="bg-white p-6 md:p-8 rounded-[28px] shadow-[0_25px_80px_-55px_rgba(15,23,42,0.8)] border border-white/80">
              <h2 className="text-2xl font-bold mb-6">Property Specifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {property.yearBuilt && (
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-teal-50 to-slate-50 rounded-xl">
                    <div>
                      <span className="text-sm text-gray-500">Year Built</span>
                      <p className="font-bold text-lg">{property.yearBuilt}</p>
                    </div>
                    <div className="text-2xl text-teal-600">
                      <HomeIcon className="w-6 h-6" />
                    </div>
                  </div>
                )}
                {property.lotSize && (
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-teal-50 to-slate-50 rounded-xl">
                    <div>
                      <span className="text-sm text-gray-500">Lot Size</span>
                      <p className="font-bold text-lg">{property.lotSize}</p>
                    </div>
                    <div className="text-2xl text-teal-600">
                      <Ruler className="w-6 h-6" />
                    </div>
                  </div>
                )}
                {property.parkingSpaces && (
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-teal-50 to-slate-50 rounded-xl">
                    <div>
                      <span className="text-sm text-gray-500">Parking Spaces</span>
                      <p className="font-bold text-lg">{property.parkingSpaces}</p>
                    </div>
                    <div className="text-2xl text-teal-600">
                      <Car className="w-6 h-6" />
                    </div>
                  </div>
                )}
                {property.utilities && property.utilities.length > 0 && (
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-teal-50 to-slate-50 rounded-xl">
                    <div>
                      <span className="text-sm text-gray-500">Utilities</span>
                      <p className="font-bold text-lg">{property.utilities.join(', ')}</p>
                    </div>
                    <div className="text-2xl text-teal-600">
                      <Zap className="w-6 h-6" />
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Neighborhood Information */}
            {property.neighborhood && (
              <section className="bg-white p-6 md:p-8 rounded-[28px] shadow-[0_25px_80px_-55px_rgba(15,23,42,0.8)] border border-white/80">
                <h2 className="text-2xl font-bold mb-6">Neighborhood</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-bold text-lg mb-3">{property.neighborhood.name}</h3>
                    <p className="text-gray-600 mb-4">A vibrant community with excellent amenities and convenient access to downtown.</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-green-600">•</span>
                        <span className="text-sm">Crime Rate: {property.neighborhood.crimeRate}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold mb-3">Nearby Schools</h4>
                    <ul className="space-y-2">
                      {property.neighborhood.schools?.map((school, i) => (
                        <li key={i} className="flex items-center gap-2 p-2 bg-gradient-to-r from-teal-50 to-slate-50 rounded">
                          <School className="w-4 h-4 text-teal-600" />
                          <span>{school}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>
            )}

            {/* Price History */}
            {property.priceHistory && property.priceHistory.length > 0 && (
              <section className="bg-white p-6 md:p-8 rounded-[28px] shadow-[0_25px_80px_-55px_rgba(15,23,42,0.8)] border border-white/80">
                <h2 className="text-2xl font-bold mb-6">Price History</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {property.priceHistory.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50">
                      <div className="text-sm text-slate-500">{item.date}</div>
                      <div className="font-semibold text-slate-900">{item.price}</div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Reviews */}
            <section className="bg-white p-6 md:p-8 rounded-[28px] shadow-[0_25px_80px_-55px_rgba(15,23,42,0.8)] border border-white/80">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">Reviews</h2>
                <div className="flex items-center gap-3">
                  <StarRating rating={parseFloat(avgRating)} size="md" />
                  <span className="font-bold text-xl">{avgRating}</span>
                  <span className="text-gray-500">({propertyReviews.length})</span>
                </div>
              </div>

              <div className="space-y-8">
                {propertyReviews.length > 0 ? (
                  propertyReviews.map(review => (
                    <div key={review.id} className="border-b pb-8 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl">
                            {review.userName[0]}
                          </div>
                          <div>
                            <h4 className="font-bold text-lg">{review.userName}</h4>
                            <p className="text-sm text-gray-500">{review.date}</p>
                          </div>
                        </div>
                        <StarRating rating={review.rating} size="md" />
                      </div>
                      <p className="text-gray-700 italic leading-relaxed">"{review.comment}"</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    No reviews yet. Be the first to write one!
                  </div>
                )}
              </div>

              {/* Review Form */}
              <div className="mt-12 pt-10 border-t">
                <h3 className="text-xl font-bold mb-6">Write a Review</h3>
                
                {!user ? (
                  <div className="bg-gradient-to-r from-teal-50 to-slate-50 p-8 rounded-2xl text-center">
                    <p className="text-lg mb-4">Please sign in to write a review</p>
                    <button
                      onClick={() => openAuthModal?.('signin')}
                      className="bg-teal-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-teal-700 transition-colors"
                    >
                      Sign In
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Your Rating</label>
                      <StarRating 
                        rating={newRating} 
                        setRating={setNewRating} 
                        interactive 
                        size="lg" 
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Your Comment</label>
                      <textarea
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                        rows={4}
                        className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none resize-none"
                        placeholder="Share your experience..."
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="bg-teal-600 hover:bg-teal-700 text-white px-10 py-4 rounded-xl font-medium transition-colors"
                    >
                      Submit Review
                    </button>
                  </form>
                )}
              </div>
            </section>

            {/* Similar Properties */}
            {property.similarProperties && property.similarProperties.length > 0 && (
              <section className="bg-white p-6 md:p-8 rounded-[28px] shadow-[0_25px_80px_-55px_rgba(15,23,42,0.8)] border border-white/80">
                <h2 className="text-2xl font-bold mb-6">Similar Properties</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {property.similarProperties.map((similarProp) => (
                    <div key={similarProp.id} className="border border-white rounded-2xl overflow-hidden shadow-[0_20px_60px_-45px_rgba(15,23,42,0.7)] hover:-translate-y-1 transition-all bg-white">
                      <div className="aspect-[16/10] relative">
                        <img
                          src={similarProp.image}
                          alt={similarProp.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-teal-100 text-teal-800">
                            For Sale
                          </span>
                        </div>
                        {similarProp.status && (
                          <div className="absolute top-3 right-3">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                              similarProp.status === 'available' 
                                ? 'bg-green-100 text-green-800' 
                                : similarProp.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {similarProp.status.toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-lg mb-2">{similarProp.title}</h3>
                        <p className="text-gray-600 text-sm mb-3">{similarProp.address}</p>
                        <div className="flex justify-between items-center">
                          <div className="flex gap-2">
                            <span className="text-sm text-gray-500">{similarProp.beds} bd</span>
                            <span className="text-sm text-gray-500">{similarProp.baths} ba</span>
                            <span className="text-sm text-gray-500">{similarProp.sqft} sqft</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-6 space-y-8">
              {/* Contact / Inquiry Card */}
              <div className="bg-white rounded-[28px] shadow-[0_25px_80px_-55px_rgba(15,23,42,0.8)] overflow-hidden border border-white/80">
                <div className="p-6 md:p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl md:text-2xl font-bold">Contact Agent</h3>
                    {property.virtualTourUrl && (
                      <button
                        onClick={() => setIsVirtualTourModalOpen(true)}
                        className="p-3 rounded-full bg-slate-100 text-slate-500 hover:text-teal-600 hover:bg-teal-50 transition-colors"
                        title="View Virtual Tour"
                      >
                        <Video className="w-6 h-6" />
                      </button>
                    )}
                  </div>

                  {!inquirySent ? (
                    <form id="inquiry-form" onSubmit={handleInquiry} className="space-y-5">
                      <input
                        name="name"
                        placeholder="Full Name"
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                        required
                      />
                      <input
                        name="email"
                        type="email"
                        placeholder="Email Address"
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                        required
                      />
                      <textarea
                        name="message"
                        rows={4}
                        placeholder="I'm interested in this property..."
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none resize-none"
                      />
                      <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 px-6 rounded-xl font-medium text-white transition-all ${
                          loading 
                            ? 'bg-teal-400 cursor-wait' 
                            : 'bg-teal-600 hover:bg-teal-700'
                        }`}
                      >
                        {loading ? 'Sending...' : 'Send Inquiry'}
                      </button>
                    </form>
                  ) : (
                    <div className="text-center py-10">
                      <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check className="w-10 h-10" />
                      </div>
                      <h4 className="text-xl font-bold mb-3">Thank You!</h4>
                      <p className="text-gray-600">
                        Your inquiry has been sent successfully.<br/>
                        We'll get back to you soon.
                      </p>
                      <button
                        onClick={() => setInquirySent(false)}
                        className="mt-6 text-teal-600 hover:underline font-medium"
                      >
                        Send another message
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Simple Agent Info */}
              <div className="bg-gradient-to-br from-teal-600 via-teal-500 to-slate-700 text-white rounded-[28px] p-8 shadow-[0_30px_90px_-50px_rgba(15,23,42,0.9)]">
                <h4 className="text-lg font-semibold mb-5 opacity-90">Listed by</h4>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-white/25 flex items-center justify-center text-2xl font-bold">
                    LA
                  </div>
                  <div>
                    <p className="font-bold text-lg">Leslie Alexander</p>
                    <p className="text-teal-100 text-sm">Senior Property Consultant</p>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <button onClick={handleScheduleViewing} className="w-full py-3 bg-white/20 hover:bg-white/30 rounded-xl transition-colors inline-flex items-center justify-center gap-2">
                    <Calendar className="w-4 h-4" /> Schedule Viewing
                  </button>
                </div>
              </div>

            </div>
          </aside>
        </div>
      </main>

            {/* Virtual Tour Modal */}
      {isVirtualTourModalOpen && property.virtualTourUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75">
          <div className="relative w-full max-w-4xl h-3/4 bg-white rounded-lg shadow-lg overflow-hidden">
            <button
              onClick={() => setIsVirtualTourModalOpen(false)}
              className="absolute top-3 right-3 text-gray-700 hover:text-gray-900 z-10 p-2 bg-white rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
            <iframe
              src={property.virtualTourUrl}
              title="Virtual Tour"
              allowFullScreen
              className="w-full h-full border-0"
            ></iframe>
          </div>
        </div>
      )}

      {/* Video Tour Modal */}
      {isVirtualTourModalOpen && property.videoTourUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75">
          <div className="relative w-full max-w-4xl h-3/4 bg-white rounded-lg shadow-lg overflow-hidden">
            <button
              onClick={() => setIsVirtualTourModalOpen(false)}
              className="absolute top-3 right-3 text-gray-700 hover:text-gray-900 z-10 p-2 bg-white rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="w-full h-full bg-black flex items-center justify-center">
              <iframe
                src={property.videoTourUrl}
                title="Video Tour"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {/* Image Lightbox */}
      {isLightboxOpen && galleryImages.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 text-white/80 hover:text-white p-2 rounded-full bg-white/10"
          >
            <X className="w-6 h-6" />
          </button>
          <button
            onClick={goPrevLightbox}
            className="absolute left-4 md:left-8 text-white/80 hover:text-white p-3 rounded-full bg-white/10"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="max-w-5xl w-[92vw] h-[80vh] flex items-center justify-center">
            <img
              src={galleryImages[lightboxIndex]}
              alt={property.title}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
          <button
            onClick={goNextLightbox}
            className="absolute right-4 md:right-8 text-white/80 hover:text-white p-3 rounded-full bg-white/10"
          >
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
};

export default PropertyDetailsPage;
