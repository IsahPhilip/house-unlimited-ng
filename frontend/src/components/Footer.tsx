import React, { useState } from 'react';
import { Facebook, Linkedin, Mail, MapPin, Phone, Send, Twitter } from 'lucide-react';
import hunLogo from '../img/hun_logo.png';
import { Page } from '../types';

interface FooterProps {
  onNavigate: (p: Page) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleNewsletterSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Basic email validation
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/newsletter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setIsSubscribed(true);
        setEmail('');
      } else {
        setError('Failed to subscribe. Please try again.');
      }
    } catch (error) {
      console.error('Newsletter signup error:', error);
      setError('An error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8">
    <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
      <div className="space-y-4">
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate('home')}>
            <img
              src={hunLogo}
              alt="House Unlimited Nigeria"
              className="h-8 w-auto mr-2"
            />
          </div>
        <p className="text-gray-400 text-sm">Empowering home seekers with expert human guidance since 1995.</p>
        <div className="flex space-x-4">
          <div className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center cursor-pointer hover:bg-teal-600 transition-colors">
            <Facebook className="w-4 h-4" />
          </div>
          <div className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center cursor-pointer hover:bg-teal-600 transition-colors">
            <Twitter className="w-4 h-4" />
          </div>
          <div className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center cursor-pointer hover:bg-teal-600 transition-colors">
            <Linkedin className="w-4 h-4" />
          </div>
        </div>
      </div>
      <div>
        <h4 className="font-bold mb-6">Company</h4>
        <ul className="space-y-3 text-gray-400 text-sm">
          <li className="hover:text-teal-400 cursor-pointer" onClick={() => onNavigate('agents')}>Our Agents</li>
          <li className="hover:text-teal-400 cursor-pointer" onClick={() => onNavigate('faq')}>FAQs</li>
          <li className="hover:text-teal-400 cursor-pointer" onClick={() => onNavigate('home')}>Testimonial</li>
          <li className="hover:text-teal-400 cursor-pointer" onClick={() => onNavigate('about')}>About Us</li>
          <li className="hover:text-teal-400 cursor-pointer" onClick={() => onNavigate('contact')}>Contact Us</li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold mb-6">Contact</h4>
        <ul className="space-y-3 text-gray-400 text-sm">
          <li className="flex items-center"><Phone className="w-4 h-4 mr-2 text-teal-500" /> +234 904 375 2708</li>
          <li className="flex items-center"><Mail className="w-4 h-4 mr-2 text-teal-500" /> official@houseunlimitednigeria.com</li>
          <li className="flex items-center"><MapPin className="w-4 h-4 mr-2 text-teal-500" /> Suite S23 Febson Mall, Wuse Zone 4, Abuja 904101, Federal Capital Territory, Nigeria</li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold mb-6">Get the latest information</h4>
        <div className="relative">
          <form onSubmit={handleNewsletterSignup}>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address" 
              className="w-full bg-slate-800 border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-teal-600 outline-none"
              disabled={isLoading}
            />
            <button 
              type="submit"
              disabled={isLoading}
              className={`absolute right-1 top-1 bottom-1 px-3 rounded-md transition-colors ${
                isLoading 
                  ? 'bg-gray-600 cursor-wait' 
                  : 'bg-teal-600 hover:bg-teal-700'
              }`}
            >
              {isLoading ? 'Subscribing...' : <Send className="w-4 h-4" />}
            </button>
          </form>
        </div>
        {error && (
          <p className="text-red-400 text-xs mt-2">{error}</p>
        )}
        {isSubscribed && (
          <p className="text-green-400 text-xs mt-2">Thank you for subscribing!</p>
        )}
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between text-gray-500 text-xs text-center md:text-left">
      <div className="flex items-center justify-center md:justify-start gap-3">
        <img
          src={hunLogo}
          alt="House Unlimited Nigeria"
          className="h-5 w-auto opacity-70"
        />
        <span>© 2024 All Rights Reserved.</span>
      </div>
      <div className="space-x-6 mt-4 md:mt-0">
        <span className="hover:text-white cursor-pointer" onClick={() => onNavigate('terms')}>User Terms & Conditions</span>
        <span className="hover:text-white cursor-pointer" onClick={() => onNavigate('privacy')}>Privacy Policy</span>
      </div>
    </div>
  </footer>
  );
};
