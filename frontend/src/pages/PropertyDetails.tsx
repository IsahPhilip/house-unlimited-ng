import React, { useEffect, useState } from 'react';
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
          <svg className={iconSize} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
          </svg>
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
          getPropertyById(propertyId),
          getReviewsByPropertyId(propertyId),
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
    <div className="bg-gray-50/40 min-h-screen">
      {/* Breadcrumbs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <button 
              onClick={onBack}
              className="hover:text-teal-600 transition-colors font-medium"
            >
              ← Back to Properties
            </button>
            <span className="text-gray-300">/</span>
            <span className="font-medium text-gray-900 truncate max-w-[300px]">
              {property.title}
            </span>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left + Center - Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Gallery */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="aspect-[16/10] md:aspect-[16/9] relative">
                <img
                  src={activeImage}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              </div>
                {property.images && property.images.length > 0 && (
                  <div className="p-4 flex gap-3 overflow-x-auto pb-2">
                  {[property.image, ...property.images].filter(Boolean).map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(img)}
                      className={`flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden border-2 transition-all ${
                        activeImage === img 
                          ? 'border-teal-600 shadow-md' 
                          : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Main Info */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm">
              <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                <div>
                  <div className="flex flex-wrap gap-3 mb-3">
                    <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold ${
                      property.category === 'rent' 
                        ? 'bg-teal-600 text-white' 
                        : 'bg-emerald-600 text-white'
                    }`}>
                      For {property.category === 'rent' ? 'Rent' : 'Sale'}
                    </span>
                    <span className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                      {property.type}
                    </span>
                    {/* Property Status Badge */}
                    {property.status && (
                      <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold ${
                        property.status === 'available' 
                          ? 'bg-green-100 text-green-800' 
                          : property.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {property.status.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    {property.title}
                  </h1>
                  <p className="text-gray-600 flex items-center text-lg">
                    <span className="mr-2">📍</span>
                    {property.address}
                  </p>
                  {/* Property History Info */}
                  {property.daysOnMarket && (
                    <p className="text-sm text-gray-500 mt-1">
                      {property.daysOnMarket} days on market
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-4xl md:text-5xl font-bold text-teal-600 mb-1">
                    {property.price}
                  </p>
                  <div className="flex items-center gap-2 justify-end">
                    <StarRating rating={parseFloat(avgRating)} size="md" />
                    <span className="font-bold text-lg">{avgRating}</span>
                    <span className="text-gray-500 text-sm">
                      ({propertyReviews.length} reviews)
                    </span>
                  </div>
                </div>
              </div>

              {/* Key Features Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-8 border-y border-gray-100">
                <div className="text-center">
                  <div className="text-3xl mb-2">🛏️</div>
                  <div className="text-2xl font-bold">{property.beds}</div>
                  <div className="text-sm text-gray-600 mt-1">Bedrooms</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">🛁</div>
                  <div className="text-2xl font-bold">{property.baths}</div>
                  <div className="text-sm text-gray-600 mt-1">Bathrooms</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">📏</div>
                  <div className="text-2xl font-bold">{property.sqft}</div>
                  <div className="text-sm text-gray-600 mt-1">Sqft</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">🏡</div>
                  <div className="text-2xl font-bold">{property.type}</div>
                  <div className="text-sm text-gray-600 mt-1">Type</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm">
              <h2 className="text-2xl font-bold mb-5">Description</h2>
              <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* Amenities */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm">
              <h2 className="text-2xl font-bold mb-6">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                {property.amenities.map((amenity, i) => (
                  <div 
                    key={i} 
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                  >
                    <div className="text-teal-600 text-xl">✓</div>
                    <span className="font-medium">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Property Specifications */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm">
              <h2 className="text-2xl font-bold mb-6">Property Specifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {property.yearBuilt && (
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <span className="text-sm text-gray-500">Year Built</span>
                      <p className="font-bold text-lg">{property.yearBuilt}</p>
                    </div>
                    <div className="text-2xl">🏠</div>
                  </div>
                )}
                {property.lotSize && (
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <span className="text-sm text-gray-500">Lot Size</span>
                      <p className="font-bold text-lg">{property.lotSize}</p>
                    </div>
                    <div className="text-2xl">📏</div>
                  </div>
                )}
                {property.parkingSpaces && (
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <span className="text-sm text-gray-500">Parking Spaces</span>
                      <p className="font-bold text-lg">{property.parkingSpaces}</p>
                    </div>
                    <div className="text-2xl">🚗</div>
                  </div>
                )}
                {property.utilities && property.utilities.length > 0 && (
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <span className="text-sm text-gray-500">Utilities</span>
                      <p className="font-bold text-lg">{property.utilities.join(', ')}</p>
                    </div>
                    <div className="text-2xl">⚡</div>
                  </div>
                )}
              </div>
            </div>

            {/* Neighborhood Information */}
            {property.neighborhood && (
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm">
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
                      <div className="flex items-center gap-2">
                        <span className="text-teal-600">•</span>
                        <span className="text-sm">Average Price: {property.neighborhood.averagePrice}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold mb-3">Nearby Schools</h4>
                    <ul className="space-y-2">
                      {property.neighborhood.schools?.map((school, i) => (
                        <li key={i} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                          <span className="text-teal-600">🏫</span>
                          <span>{school}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Reviews */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm">
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
                  <div className="bg-teal-50 p-8 rounded-2xl text-center">
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
            </div>

            {/* Similar Properties */}
            {property.similarProperties && property.similarProperties.length > 0 && (
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm">
                <h2 className="text-2xl font-bold mb-6">Similar Properties</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {property.similarProperties.map((similarProp) => (
                    <div key={similarProp.id} className="border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="aspect-[16/10] relative">
                        <img
                          src={similarProp.image}
                          alt={similarProp.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 left-3">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            similarProp.category === 'rent' 
                              ? 'bg-teal-600 text-white' 
                              : 'bg-emerald-600 text-white'
                          }`}>
                            For {similarProp.category === 'rent' ? 'Rent' : 'Sale'}
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
                          <div className="text-teal-600 font-bold text-lg">{similarProp.price}</div>
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
              </div>
            )}

            {/* Share & Print Options */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm">
              <h2 className="text-2xl font-bold mb-6">Share This Property</h2>
              <div className="flex flex-wrap gap-4">
                <button onClick={handleShare} className="flex items-center gap-3 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
                  <span className="text-lg">📱</span>
                  <span>Share</span>
                </button>
                <button onClick={handlePrint} className="flex items-center gap-3 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  <span className="text-lg">🖨️</span>
                  <span>Print</span>
                </button>
                <button onClick={handleWhatsApp} className="flex items-center gap-3 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <span className="text-lg">💬</span>
                  <span>WhatsApp</span>
                </button>
                <button onClick={handleEmail} className="flex items-center gap-3 px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors">
                  <span className="text-lg">📧</span>
                  <span>Email</span>
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-6 space-y-8">
              {/* Contact / Inquiry Card */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                <div className="p-6 md:p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl md:text-2xl font-bold">Contact Agent</h3>
                    <div className="flex space-x-2">
                      {onWishlistToggle && (
                        <button
                          onClick={() => onWishlistToggle(property.id, property)}
                          className={`p-3 rounded-full transition-colors ${
                            isWishlisted 
                              ? 'bg-red-50 text-red-600' 
                              : 'bg-gray-100 text-gray-500 hover:text-red-600'
                          }`}
                        >
                          {isWishlisted ? '❤️' : '♡'}
                        </button>
                      )}
                      {property.virtualTourUrl && (
                        <button
                          onClick={() => setIsVirtualTourModalOpen(true)}
                          className="p-3 rounded-full bg-gray-100 text-gray-500 hover:text-teal-600 hover:bg-teal-50 transition-colors"
                          title="View Virtual Tour"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                        </button>
                      )}
                    </div>
                  </div>

                  {!inquirySent ? (
                    <form id="inquiry-form" onSubmit={handleInquiry} className="space-y-5">
                      <input
                        name="name"
                        placeholder="Full Name"
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                        required
                      />
                      <input
                        name="email"
                        type="email"
                        placeholder="Email Address"
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                        required
                      />
                      <textarea
                        name="message"
                        rows={4}
                        placeholder="I'm interested in this property..."
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none resize-none"
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
                      <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
                        ✓
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
              <div className="bg-gradient-to-br from-teal-600 to-indigo-700 text-white rounded-2xl p-8 shadow-xl">
                <h4 className="text-lg font-semibold mb-5 opacity-90">Listed by</h4>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
                    LA
                  </div>
                  <div>
                    <p className="font-bold text-lg">Leslie Alexander</p>
                    <p className="text-teal-100 text-sm">Senior Property Consultant</p>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <button onClick={handleCall} className="w-full py-3 bg-white/15 hover:bg-white/25 rounded-xl transition-colors">
                    📞 Call Now
                  </button>
                  <button onClick={handleScheduleViewing} className="w-full py-3 bg-white/15 hover:bg-white/25 rounded-xl transition-colors">
                    📅 Schedule Viewing
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
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
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
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
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
    </div>
  );
};

export default PropertyDetailsPage;
