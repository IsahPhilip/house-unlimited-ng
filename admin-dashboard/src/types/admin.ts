export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'agent' | 'admin';
  isEmailVerified: boolean;
  joinDate: string;
  isActive: boolean;
  avatar?: string;
  phone?: string;
  location?: string;
  bio?: string;
  authorRole?: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  type: 'sale' | 'rent';
  propertyType: 'house' | 'apartment' | 'commercial' | 'land';
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  images: string[];
  agent: {
    id: string;
    name: string;
    email: string;
  };
  status: 'available' | 'sold' | 'rented' | 'pending';
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  propertyId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  propertyId?: string;
  propertyTitle?: string;
  budget: string;
  requirements: string[];
  status: 'pending' | 'in_progress' | 'resolved' | 'closed';
  source: 'general' | 'property_inquiry' | 'partnership' | 'complaint' | 'other';
  createdAt: string;
  updatedAt: string;
}

export interface Deal {
  id: string;
  propertyId: string;
  propertyTitle: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  agentId: string;
  agentName: string;
  offerPrice: number;
  acceptedPrice?: number;
  status: 'pending' | 'accepted' | 'rejected' | 'closed';
  createdAt: string;
  updatedAt: string;
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  propertiesCount: number;
  dealsCount: number;
  totalSales: number;
  rating: number;
  isActive: boolean;
  joinDate: string;
}

export interface Notification {
  id: string;
  type: 'new_lead' | 'deal_update' | 'appointment' | 'property_update';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  relatedId?: string;
}

export interface MediaItem {
  type: 'image' | 'video';
  title: string;
  url: string;
}

export interface AdminSettings {
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  timezone: string;
  dateFormat: string;
  currency: string;
  mediaGallery?: MediaItem[];
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  security: {
    twoFactorAuth: boolean;
    sessionTimeout: number;
    passwordExpiry: number;
  };
}

export interface RevenueReport {
  totalRevenue: number;
  monthlyRevenue: Array<{ month: string; revenue: number }>;
}

export interface LeadSourceReportItem {
  source: string;
  count: number;
}

export interface PropertyTypeReportItem {
  type: string;
  count: number;
}

export interface DashboardStats {
  totalProperties: number;
  totalLeads: number;
  totalDeals: number;
  totalAgents: number;
  totalRevenue: number;
  activeProperties: number;
  pendingLeads: number;
  closedDeals: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  category: string;
  tags: string[];
  metaTitle?: string;
  metaDescription?: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
  status: 'draft' | 'published' | 'archived';
  readTime: number;
  views: number;
  likes: number;
  commentsCount: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface BlogComment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  status: 'visible' | 'hidden';
  hiddenAt?: string | null;
  user: {
    id: string;
    name: string;
    email?: string;
    avatar?: string;
    role?: string;
    isActive?: boolean;
  } | null;
  post: {
    id: string;
    title: string;
    slug?: string;
  } | null;
}
