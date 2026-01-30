// Admin Dashboard Types and Interfaces

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'agent' | 'user';
  avatar?: string;
  status: 'active' | 'inactive';
  lastLogin?: string;
  createdAt: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  priceValue: number;
  type: 'apartment' | 'house' | 'condo' | 'townhouse' | 'land' | 'commercial' | 'other';
  category: 'rent' | 'sale';
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  beds: number;
  baths: number;
  sqft: number;
  yearBuilt?: number;
  parking?: number;
  lotSize?: number;
  images: string[];
  featuredImage: string;
  amenities: string[];
  features: string[];
  coordinates: [number, number];
  status: 'available' | 'pending' | 'sold' | 'rented' | 'draft';
  featured: boolean;
  agent: User;
  virtualTourUrl?: string;
  floorPlanUrl?: string;
  videoUrl?: string;
  propertyTaxes?: number;
  hoaFees?: number;
  utilities: {
    electricity: boolean;
    gas: boolean;
    water: boolean;
    internet: boolean;
    cable: boolean;
  };
  petPolicy?: {
    allowed: boolean;
    restrictions?: string;
    deposit?: number;
    monthlyFee?: number;
  };
  leaseTerms?: {
    minLease: number;
    maxLease: number;
    applicationFee?: number;
    securityDeposit?: number;
    petDeposit?: number;
  };
  createdAt: string;
  updatedAt: string;
  views?: number;
  inquiries?: number;
  averageRating?: number;
  reviewCount?: number;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: 'new' | 'contacted' | 'qualified' | 'negotiation' | 'closed_won' | 'closed_lost';
  source: 'website' | 'email' | 'phone' | 'walk-in' | 'referral' | 'social_media' | 'other';
  assignedAgent?: User;
  propertyInterest?: Property;
  budget?: number;
  timeline?: string;
  notes?: string;
  lastActivity?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Deal {
  id: string;
  title: string;
  lead: Lead;
  property: Property;
  agent: User;
  stage: 'new' | 'viewing_scheduled' | 'offer_made' | 'under_contract' | 'closed_won' | 'closed_lost';
  value: number;
  probability: number;
  expectedCloseDate?: string;
  actualCloseDate?: string;
  commission?: number;
  documents?: string[];
  notes?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface KpiCard {
  title: string;
  value: number | string;
  change?: number;
  icon: React.ReactNode;
  color?: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string;
    tension?: number;
  }[];
}

export interface Activity {
  id: string;
  type: 'lead_created' | 'property_added' | 'deal_updated' | 'message_received' | 'appointment_scheduled';
  user: User;
  relatedItem?: Property | Lead | Deal;
  message?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  type: 'new_lead' | 'new_inquiry' | 'deal_update' | 'appointment' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface Agent {
  id: string;
  user: User;
  propertiesAssigned: number;
  dealsClosed: number;
  performanceScore: number;
  bio?: string;
  specialties?: string[];
  languages?: string[];
  licenseNumber?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
}

export interface Inquiry {
  id: string;
  property: Property;
  sender: {
    name: string;
    email: string;
    phone?: string;
  };
  message: string;
  status: 'unread' | 'read' | 'replied';
  source?: string;
  createdAt: string;
  repliedAt?: string;
  reply?: string;
}

export interface Report {
  id: string;
  title: string;
  type: 'lead_sources' | 'property_performance' | 'agent_performance' | 'sales_trends' | 'inventory_aging';
  data: any;
  generatedAt: string;
  dateRange: {
    start: string;
    end: string;
  };
}

export interface Settings {
  siteName: string;
  currency: string;
  measurementUnits: 'metric' | 'imperial';
  defaultPropertyType?: string;
  defaultLocation?: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
}

export interface SidebarItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  children?: SidebarItem[];
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export interface TableColumn<T> {
  header: string;
  accessor: keyof T;
  sortable?: boolean;
  filterable?: boolean;
  cell?: (value: any, row: T) => React.ReactNode;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
}

export interface Filter {
  field: string;
  value: string | number | boolean;
  operator?: 'equals' | 'contains' | 'greaterThan' | 'lessThan';
}

export interface Sort {
  field: string;
  direction: 'asc' | 'desc';
}