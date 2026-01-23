import React, { useState, useEffect } from 'react';
import { AuthMode, User, Review, Property, Page } from '../types';
import { PROPERTIES, INITIAL_REVIEWS } from '../utils/mockData';
import { StarRating } from '../components/StarRating';

interface PropertyDetailsPageProps {
  property?: Property;              // optional - falls back to sample if not provided
  reviews?: Review[];
  user?: User | null;
  onAddReview?: (review: Omit<Review, 'id' | 'date'>) => void;
  onWishlistToggle?: (id: number) => void;
  isWishlisted?: boolean;
  onBack?: () => void;
}

const PropertyDetailsPage: React.FC<PropertyDetailsPageProps> = ({
  property: propProperty,
  reviews: propReviews = INITIAL_REVIEWS,
  user = null,
  onAddReview,
  onWishlistToggle,
  isWishlisted = false,
  onBack,
}) => {
  const property = propProperty || PROPERTIES[0];
  
  const [activeImage, setActiveImage] = useState(property.image);
  const [inquirySent, setInquirySent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isVirtualTourModalOpen, setIsVirtualTourModalOpen] = useState(false); // New state for virtual tour modal
  
  // Review form
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');

  const propertyReviews = propReviews.filter(r => r.propertyId === property.id);
  const avgRating = propertyReviews.length > 0 
    ? (propertyReviews.reduce((sum, r) => sum + r.rating, 0) / propertyReviews.length).toFixed(1)
    : "0.0";

  const handleInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API / AI response
    setTimeout(() => {
      setInquirySent(true);
      setLoading(false);
    }, 1200);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !onAddReview) return;
    
    onAddReview({
      propertyId: property.id,
      userName: user.name,
      rating: newRating,
      comment: newComment
    });
    
    setNewComment('');
    setNewRating(5);
  };

  return (
    <div className="bg-gray-50/40 min-h-screen">
      {/* Breadcrumbs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <button 
              onClick={onBack}
              className="hover:text-blue-600 transition-colors font-medium"
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
                  {[property.image, ...property.images].map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(img)}
                      className={`flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden border-2 transition-all ${
                        activeImage === img 
                          ? 'border-blue-600 shadow-md' 
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
                        ? 'bg-blue-600 text-white' 
                        : 'bg-emerald-600 text-white'
                    }`}>
                      For {property.category === 'rent' ? 'Rent' : 'Sale'}
                    </span>
                    <span className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                      {property.type}
                    </span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    {property.title}
                  </h1>
                  <p className="text-gray-600 flex items-center text-lg">
                    <span className="mr-2">📍</span>
                    {property.address}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-4xl md:text-5xl font-bold text-blue-600 mb-1">
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
                    <div className="text-blue-600 text-xl">✓</div>
                    <span className="font-medium">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

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
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl">
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
                  <div className="bg-blue-50 p-8 rounded-2xl text-center">
                    <p className="text-lg mb-4">Please sign in to write a review</p>
                    <button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors">
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
                        className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                        placeholder="Share your experience..."
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl font-medium transition-colors"
                    >
                      Submit Review
                    </button>
                  </form>
                )}
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
                    {onWishlistToggle && (
                      <button
                        onClick={() => onWishlistToggle(property.id)}
                        className={`p-3 rounded-full transition-colors ${
                          isWishlisted 
                            ? 'bg-red-50 text-red-600' 
                            : 'bg-gray-100 text-gray-500 hover:text-red-600'
                        }`}
                      >
                        {isWishlisted ? '❤️' : '♡'}
                      </button>
                    )}
                    {/* New: Virtual Tour Button */}
                    {property.virtualTourUrl && (
                      <button
                        onClick={() => setIsVirtualTourModalOpen(true)}
                        className="p-3 rounded-full bg-gray-100 text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title="View Virtual Tour"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                      </button>
                    )}
                  </div>

                  {!inquirySent ? (
                    <form onSubmit={handleInquiry} className="space-y-5">
                      <input
                        placeholder="Full Name"
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        required
                      />
                      <input
                        type="email"
                        placeholder="Email Address"
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        required
                      />
                      <textarea
                        rows={4}
                        placeholder="I'm interested in this property..."
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                      />
                      <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 px-6 rounded-xl font-medium text-white transition-all ${
                          loading 
                            ? 'bg-blue-400 cursor-wait' 
                            : 'bg-blue-600 hover:bg-blue-700'
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
                        className="mt-6 text-blue-600 hover:underline font-medium"
                      >
                        Send another message
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Simple Agent Info */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl p-8 shadow-xl">
                <h4 className="text-lg font-semibold mb-5 opacity-90">Listed by</h4>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
                    LA
                  </div>
                  <div>
                    <p className="font-bold text-lg">Leslie Alexander</p>
                    <p className="text-blue-100 text-sm">Senior Property Consultant</p>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <button className="w-full py-3 bg-white/15 hover:bg-white/25 rounded-xl transition-colors">
                    📞 Call Now
                  </button>
                  <button className="w-full py-3 bg-white/15 hover:bg-white/25 rounded-xl transition-colors">
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
    </div>
  );
};

export default PropertyDetailsPage;