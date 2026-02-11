import React, { useState } from 'react';
import { Page, User } from '../types';
import hunLogo from '../img/hun_logo.png';

interface NavbarProps {
  currentPage: Page;
  setCurrentPage: (p: Page) => void;
  user: User | null;
  openAuthModal: (mode: 'signin' | 'signup') => void;
  logout: () => void;
  wishlistCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  currentPage, 
  setCurrentPage, 
  user, 
  openAuthModal, 
  logout,
  wishlistCount
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
            <img
              src={hunLogo}
              alt="House Unlimited Nigeria"
              className="h-10 w-auto"
            />
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => handleNavigate(item.page)}
                className={`capitalize font-medium transition-colors ${currentPage === item.page ? 'text-teal-600' : 'text-gray-600 hover:text-teal-600'}`}
              >
                {item.label}
              </button>
            ))}
            {user && (
              <button
                onClick={() => handleNavigate('wishlist')}
                className={`capitalize font-medium transition-colors flex items-center ${currentPage === 'wishlist' ? 'text-teal-600' : 'text-gray-600 hover:text-teal-600'}`}
              >
                Wishlist
                {wishlistCount > 0 && (
                  <span className="ml-2 bg-teal-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
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
                <button
                  type="button"
                  onClick={() => handleNavigate('profile')}
                  title="View profile"
                  className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center border border-teal-200 shadow-sm cursor-pointer hover:bg-teal-200 transition-colors"
                >
                  <span className="text-teal-600 font-bold uppercase">{user.name.charAt(0)}</span>
                </button>
              </div>
            ) : (
              <>
                <button onClick={() => openAuthModal('signin')} className="text-gray-600 font-bold hover:text-teal-600 transition-colors text-sm px-4">Sign In</button>
                <button onClick={() => openAuthModal('signup')} className="bg-teal-600 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-teal-700 transition-all text-sm shadow-lg shadow-teal-100">Sign Up</button>
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
                  className={`text-left text-lg font-semibold py-2 px-4 rounded-xl transition-colors ${currentPage === item.page ? 'bg-teal-50 text-teal-600' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  {item.label.charAt(0).toUpperCase() + item.label.slice(1)}
                </button>
              ))}
              {user && (
                <>
                  <button
                    onClick={() => handleNavigate('wishlist')}
                    className={`text-left text-lg font-semibold py-2 px-4 rounded-xl flex items-center justify-between transition-colors ${currentPage === 'wishlist' ? 'bg-teal-50 text-teal-600' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    Wishlist
                    {wishlistCount > 0 && (
                      <span className="bg-teal-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                        {wishlistCount}
                      </span>
                    )}
                  </button>
                </>
              )}
            </div>
            
            <div className="pt-6 border-t border-gray-100">
              {user ? (
                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => handleNavigate('profile')}
                    className="flex items-center space-x-3 text-left hover:opacity-90 transition-opacity"
                  >
                    <div className="w-10 h-10 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </button>
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
                    className="w-full py-3 px-4 text-center font-bold text-white bg-teal-600 rounded-xl shadow-lg shadow-teal-200"
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
