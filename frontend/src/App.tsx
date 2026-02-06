import React, { useState, useEffect } from 'react';
import { Page, User, Review, Property, BlogArticle } from './types';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Phone, Mail, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { getWishlist, addToWishlist, removeFromWishlist } from './services/api';

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

// --- Types ---
type AuthMode = 'signin' | 'signup';

// --- App Container ---
const AppContent = () => {
  const { user, login, register, logout, isLoading, updateProfile } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('signin');
  const [searchCriteria, setSearchCriteria] = useState<any | null>(null);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [wishlistProperties, setWishlistProperties] = useState<Property[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isForgotPasswordFlowActive, setIsForgotPasswordFlowActive] = useState(false);
  const [resetPasswordEmail, setResetPasswordEmail] = useState<string | null>(null);
  const [resetToken, setResetToken] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage, selectedBlogId, isForgotPasswordFlowActive]);

  useEffect(() => {
    const loadWishlist = async () => {
      if (!user) {
        setWishlistIds([]);
        setWishlistProperties([]);
        return;
      }
      try {
        const wishlist = await getWishlist();
        setWishlistIds(wishlist.map((p: any) => p._id || p.id));
        setWishlistProperties(wishlist as Property[]);
      } catch (error) {
        console.error('Failed to load wishlist:', error);
      }
    };

    loadWishlist();
  }, [user]);

  // Handle URL query for direct property links and reset password links
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const blogId = params.get('blogId');
    const token = params.get('token'); // Check for reset token in URL

    if (id) {
      setSelectedPropertyId(id);
      setCurrentPage('property-details');
    } else if (blogId) {
      // Blog IDs will be validated when fetching from API
      setSelectedBlogId(blogId);
      setCurrentPage('blog-details');
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

  const handleWishlistToggle = (id: string, property?: Property) => {
    if (!user) {
      openAuthModal('signin');
      return;
    }

    const prevIds = [...wishlistIds];
    const prevProps = [...wishlistProperties];
    const isSaved = wishlistIds.includes(id);

    if (isSaved) {
      setWishlistIds(prev => prev.filter(wishId => wishId !== id));
      setWishlistProperties(prev => prev.filter(p => (p.id || (p as any)._id) !== id));
    } else {
      setWishlistIds(prev => [...prev, id]);
      if (property) {
        setWishlistProperties(prev => [...prev, property]);
      }
    }

    const update = async () => {
      try {
        if (isSaved) {
          await removeFromWishlist(id);
        } else {
          await addToWishlist(id);
        }
        const wishlist = await getWishlist();
        setWishlistIds(wishlist.map((p: any) => p._id || p.id));
        setWishlistProperties(wishlist as Property[]);
      } catch (error) {
        console.error('Failed to update wishlist:', error);
        setWishlistIds(prevIds);
        setWishlistProperties(prevProps);
      }
    };

    update();
  };

  const handleAddReview = (reviewData: Omit<Review, 'id' | 'date'>) => {
    const newReview: Review = {
      ...reviewData,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0]
    };
    setReviews(prev => [newReview, ...prev]);
  };

  const navigateToProperty = (id: string) => {
    setSelectedPropertyId(id);
    setCurrentPage('property-details');
  };

  const handleNavigateToBlog = (page: Page, id?: string) => {
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
      case 'wishlist': return <WishlistPage wishlistIds={wishlistIds} wishlistProperties={wishlistProperties} onWishlistToggle={handleWishlistToggle} setAppPage={setCurrentPage} onNavigate={navigateToProperty} />;
      case 'property-details':
        return selectedPropertyId ? (
          <PropertyDetailsPage
            propertyId={selectedPropertyId}
            user={user}
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
            onNavigateProperty={navigateToProperty}
            onUpdateProfile={(updates) => {
              updateProfile(updates);
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
            <span className="flex items-center"><Phone className="w-4 h-4 mr-2 text-blue-500" /> +234 904 375 2708</span>
            <span className="flex items-center"><Mail className="w-4 h-4 mr-2 text-blue-500" /> official@houseunlimitednigeria.com</span>
          </div>
          <div className="flex space-x-4">
            <Facebook className="w-4 h-4 hover:text-blue-500 cursor-pointer transition-colors" />
            <Twitter className="w-4 h-4 hover:text-blue-500 cursor-pointer transition-colors" />
            <Instagram className="w-4 h-4 hover:text-blue-500 cursor-pointer transition-colors" />
            <Linkedin className="w-4 h-4 hover:text-blue-500 cursor-pointer transition-colors" />
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

export default App;
