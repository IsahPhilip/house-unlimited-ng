import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Page, User, Review, Property, BlogArticle } from './types';
import { PROPERTIES, INITIAL_REVIEWS, BLOGS } from './utils/mockData';
import { AuthProvider, useAuth } from './contexts/AuthContext';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { Home } from './pages/Home';
import { PropertyPage } from './pages/Property';
import WishlistPage from './pages/Wishlist';
import BlogPage from './pages/Blog';
import AboutPage from './pages/About';
import ContactPage from './pages/Contact';
import FAQPage from './pages/FAQ';
import PolicyPage from './pages/Policy';
import AgentsPage from './pages/Agents';
import BlogDetailsPage from './pages/BlogDetails';
import PropertyDetailsPage from './pages/PropertyDetails';
import UserProfilePage from './pages/UserProfile';
import ResetPasswordPage from './pages/ResetPassword';
import ResetPasswordEmailSentPage from './pages/ResetPasswordEmailSent';
import Banner from './components/Banner'; // Import the Banner component

// --- Types ---
type AuthMode = 'signin' | 'signup';

// --- App Container ---
const AppContent = () => {
  const { user, login, register, logout, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('signin');
  const [searchCriteria, setSearchCriteria] = useState<any | null>(null);
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);
  const [selectedBlogId, setSelectedBlogId] = useState<number | null>(null);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [isForgotPasswordFlowActive, setIsForgotPasswordFlowActive] = useState(false);
  const [resetPasswordEmail, setResetPasswordEmail] = useState<string | null>(null);
  const [resetToken, setResetToken] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage, selectedBlogId, isForgotPasswordFlowActive]);

  // Handle URL query for direct property links and reset password links
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const blogId = params.get('blogId');
    const token = params.get('token'); // Check for reset token in URL

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
    } else if (token) {
      setResetToken(token);
      setIsForgotPasswordFlowActive(true);
      setCurrentPage('reset-password'); // Set a new page for reset password
    }
  }, []);

  const handleSearch = (criteria: any) => {
    setSearchCriteria(criteria);
    setCurrentPage('property');
  };

  const openAuthModal = (mode: AuthMode) => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
    setIsForgotPasswordFlowActive(false); // Ensure forgot password flow is inactive when opening auth modal
  };

  const handleLogout = () => {
    logout();
    setWishlistIds([]);
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

  // Function to handle forgot password request from AuthModal
  const handleForgotPasswordRequest = (email: string) => {
    console.log('Sending forgot password request for email:', email);
    setResetPasswordEmail(email);
    setIsForgotPasswordFlowActive(true);
    setIsAuthModalOpen(false); // Close the auth modal
    setCurrentPage('reset-password-email-sent'); // Indicate that email has been sent
    // In a real app, you would make an API call here to send the reset link
  };



  const handleResetPasswordSubmit = (newPassword: string, token: string) => {
    console.log('Resetting password with new password:', newPassword, 'and token:', token);
    // In a real app, you would make an API call here to reset the password
    alert('Password reset successfully! Please sign in with your new password.');
    setIsForgotPasswordFlowActive(false);
    setResetPasswordEmail(null);
    setResetToken(null);
    setCurrentPage('home'); // Or navigate to signin page
    openAuthModal('signin');
  };

  const renderPage = () => {
    if (isForgotPasswordFlowActive && currentPage === 'reset-password') {
      return <ResetPasswordPage email={resetPasswordEmail} token={resetToken} onSubmit={handleResetPasswordSubmit} onNavigate={setCurrentPage} />;
    } else if (currentPage === 'reset-password-email-sent') {
      return <ResetPasswordEmailSentPage email={resetPasswordEmail || ''} onNavigate={setCurrentPage} />;
    }
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
            reviews={reviews.filter(r => r.propertyId === selectedPropertyId)}
            user={user}
            onAddReview={handleAddReview}
            onWishlistToggle={(id) => handleWishlistToggle(id)}
            isWishlisted={wishlistIds.includes(selectedPropertyId)}
            onBack={() => setCurrentPage('property')}
            openAuthModal={openAuthModal}
          />
        ) : (
          <Home onSearch={handleSearch} wishlistIds={wishlistIds} onWishlistToggle={handleWishlistToggle} onNavigate={navigateToProperty} />
        );
      case 'profile':
        return (
          <UserProfilePage
            user={user}
            wishlistIds={wishlistIds}
            reviews={reviews}
            onNavigate={setCurrentPage}
            onUpdateProfile={(updates) => {
              // Profile updates would be handled via API call
              // For now, we'll just log the update
              console.log('Profile update:', updates);
            }}
            onWishlistToggle={handleWishlistToggle}
          />
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
        logout={handleLogout}
        wishlistCount={wishlistIds.length}
      />
      
      {renderPage()}
      
      <Footer onNavigate={setCurrentPage} />
      
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
        setMode={setAuthMode}
        onSuccess={(userData) => {
          // This will be handled by the AuthContext
          setIsAuthModalOpen(false);
        }}
        onForgotPasswordClick={handleForgotPasswordRequest}
      />
      <Banner />
    </div>
  );
};

// --- App Wrapper ---
const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

// --- Initialization ---
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
