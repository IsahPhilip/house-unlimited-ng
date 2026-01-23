export type Page = 'home' | 'property' | 'blog' | 'about' | 'contact' | 'wishlist' | 'property-details' | 'faq' | 'terms' | 'privacy' | 'agents' | 'blog-details' | 'reset-password' | 'reset-password-email-sent' | 'profile';
export type AuthMode = 'signin' | 'signup';
export type ViewMode = 'grid' | 'map';

export interface User {
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  location?: string;
  joinDate?: string;
  preferences?: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    favoritePropertyTypes: string[];
    priceRange: {
      min: number;
      max: number;
    };
  };
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
}

export interface SearchCriteria {
  location: string;
  type: string;
  priceRange: string;
  category: 'buy' | 'rent' | 'all';
}

export interface Review {
  id: number;
  propertyId: number;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Property {
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
  virtualTourUrl?: string;
}

export interface BlogArticle {
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

export interface TeamMember {
  name: string;
  role: string;
  image: string;
}

export interface Principle {
  title: string;
  desc: string;
  icon: string;
}

export interface FAQ {
  question: string;
  answer: string;
}
