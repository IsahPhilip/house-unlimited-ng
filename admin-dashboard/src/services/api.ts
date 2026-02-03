import { User, Property, Review, Lead, Deal, Agent, DashboardStats, ApiResponse, BlogPost, Notification, AdminSettings, RevenueReport, LeadSourceReportItem, PropertyTypeReportItem } from '../types/admin';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const extractData = <T>(payload: any): T => {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return payload.data as T;
  }
  return payload as T;
};

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// Auth API
export const login = async (email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    const normalized = {
      success: data.success ?? true,
      data: {
        user: data.data ?? data.user,
        token: data.token ?? data.data?.token ?? data.data?.accessToken,
      },
      message: data.message,
      error: data.error,
    };

    if (!normalized.data.user || !normalized.data.token) {
      throw new Error('Login response missing user or token');
    }

    return normalized;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }

    const data = await response.json();
    return extractData<User>(data);
  } catch (error) {
    console.error('Get user error:', error);
    throw error;
  }
};

export const getProfile = async (): Promise<User> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }

    const data = await response.json();
    return extractData<User>(data);
  } catch (error) {
    console.error('Get profile error:', error);
    throw error;
  }
};

export const updateProfile = async (profileData: Partial<User>): Promise<User> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      throw new Error('Failed to update profile');
    }

    const data = await response.json();
    return extractData<User>(data);
  } catch (error) {
    console.error('Update profile error:', error);
    throw error;
  }
};

// Dashboard API
export const getDashboardStats = async (): Promise<DashboardStats & { recentProperties?: any[]; recentActivities?: any[] }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/dashboard/stats`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch dashboard stats');
    }

    const data = await response.json();
    return extractData<DashboardStats & { recentProperties?: any[]; recentActivities?: any[] }>(data);
  } catch (error) {
    console.error('Dashboard stats error:', error);
    throw error;
  }
};

// Properties API
export const getProperties = async (): Promise<Property[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/properties`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch properties');
    }

    const data = await response.json();
    return extractData<Property[]>(data);
  } catch (error) {
    console.error('Properties error:', error);
    throw error;
  }
};

export const getPropertyById = async (id: string): Promise<Property> => {
  try {
    const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch property');
    }

    const data = await response.json();
    return extractData<Property>(data);
  } catch (error) {
    console.error('Property error:', error);
    throw error;
  }
};

export const createProperty = async (propertyData: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>): Promise<Property> => {
  try {
    const response = await fetch(`${API_BASE_URL}/properties`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(propertyData),
    });

    if (!response.ok) {
      throw new Error('Failed to create property');
    }

    const data = await response.json();
    return extractData<Property>(data);
  } catch (error) {
    console.error('Create property error:', error);
    throw error;
  }
};

export const updateProperty = async (id: string, propertyData: Partial<Property>): Promise<Property> => {
  try {
    const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(propertyData),
    });

    if (!response.ok) {
      throw new Error('Failed to update property');
    }

    const data = await response.json();
    return extractData<Property>(data);
  } catch (error) {
    console.error('Update property error:', error);
    throw error;
  }
};

export const deleteProperty = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete property');
    }
  } catch (error) {
    console.error('Delete property error:', error);
    throw error;
  }
};

// Users API
export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }

    const data = await response.json();
    return extractData<User[]>(data);
  } catch (error) {
    console.error('Users error:', error);
    throw error;
  }
};

export const getUserById = async (id: string): Promise<User> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }

    const data = await response.json();
    return extractData<User>(data);
  } catch (error) {
    console.error('User error:', error);
    throw error;
  }
};

// Reviews API
export const getReviews = async (): Promise<Review[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/reviews`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch reviews');
    }

    const data = await response.json();
    return extractData<Review[]>(data);
  } catch (error) {
    console.error('Reviews error:', error);
    throw error;
  }
};

// Leads API
export const getLeads = async (): Promise<Lead[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/leads`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch leads');
    }

    const data = await response.json();
    return extractData<Lead[]>(data);
  } catch (error) {
    console.error('Leads error:', error);
    throw error;
  }
};

export const createLead = async (leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Promise<Lead> => {
  try {
    const response = await fetch(`${API_BASE_URL}/contact/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(leadData),
    });

    if (!response.ok) {
      throw new Error('Failed to create lead');
    }

    const data = await response.json();
    return extractData<Lead>(data);
  } catch (error) {
    console.error('Create lead error:', error);
    throw error;
  }
};

// Deals API
export const getDeals = async (): Promise<Deal[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/deals`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch deals');
    }

    const data = await response.json();
    return extractData<Deal[]>(data);
  } catch (error) {
    console.error('Deals error:', error);
    throw error;
  }
};

// Agents API
export const getAgents = async (): Promise<Agent[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/agents`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch agents');
    }

    const data = await response.json();
    return extractData<Agent[]>(data);
  } catch (error) {
    console.error('Agents error:', error);
    throw error;
  }
};

export const createDeal = async (deal: any): Promise<Deal> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/deals`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(deal),
    });

    if (!response.ok) {
      throw new Error('Failed to create deal');
    }

    const data = await response.json();
    return extractData<Deal>(data);
  } catch (error) {
    console.error('Create deal error:', error);
    throw error;
  }
};

export const updateDeal = async (id: string, deal: Partial<Deal>): Promise<Deal> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/deals/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(deal),
    });

    if (!response.ok) {
      throw new Error('Failed to update deal');
    }

    const data = await response.json();
    return extractData<Deal>(data);
  } catch (error) {
    console.error('Update deal error:', error);
    throw error;
  }
};

export const approveDeal = async (id: string): Promise<Deal> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/deals/${id}/approve`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to approve deal');
    }

    const data = await response.json();
    return extractData<Deal>(data);
  } catch (error) {
    console.error('Approve deal error:', error);
    throw error;
  }
};

export const closeDeal = async (id: string): Promise<Deal> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/deals/${id}/close`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to close deal');
    }

    const data = await response.json();
    return extractData<Deal>(data);
  } catch (error) {
    console.error('Close deal error:', error);
    throw error;
  }
};

// Inquiries API (mapped from contacts)
export const getInquiries = async (): Promise<any[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/inquiries`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch inquiries');
    }

    const data = await response.json();
    return extractData<any[]>(data);
  } catch (error) {
    console.error('Inquiries error:', error);
    throw error;
  }
};

// Notifications API
export const getNotifications = async (): Promise<Notification[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/notifications`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch notifications');
    }

    const data = await response.json();
    return extractData<Notification[]>(data);
  } catch (error) {
    console.error('Notifications error:', error);
    throw error;
  }
};

export const markNotificationRead = async (id: string, read: boolean): Promise<Notification> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/notifications/${id}/read`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ read }),
    });

    if (!response.ok) {
      throw new Error('Failed to update notification');
    }

    const data = await response.json();
    return extractData<Notification>(data);
  } catch (error) {
    console.error('Update notification error:', error);
    throw error;
  }
};

export const markAllNotificationsRead = async (read: boolean): Promise<{ read: boolean }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/notifications/read-all`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ read }),
    });

    if (!response.ok) {
      throw new Error('Failed to update notifications');
    }

    const data = await response.json();
    return extractData<{ read: boolean }>(data);
  } catch (error) {
    console.error('Update all notifications error:', error);
    throw error;
  }
};

// Admin settings API
export const getAdminSettings = async (): Promise<AdminSettings> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/settings`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch settings');
    }

    const data = await response.json();
    return extractData<AdminSettings>(data);
  } catch (error) {
    console.error('Admin settings error:', error);
    throw error;
  }
};

export const updateAdminSettings = async (settings: AdminSettings): Promise<AdminSettings> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/settings`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(settings),
    });

    const data = await response.json();
    if (!response.ok) {
      throw data;
    }
    return extractData<AdminSettings>(data);
  } catch (error) {
    console.error('Update admin settings error:', error);
    throw error;
  }
};

// Reports API
export const getRevenueReport = async (start?: string, end?: string): Promise<RevenueReport> => {
  try {
    const params = new URLSearchParams();
    if (start) params.set('start', start);
    if (end) params.set('end', end);
    const query = params.toString();
    const response = await fetch(`${API_BASE_URL}/admin/reports/revenue${query ? `?${query}` : ''}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch revenue report');
    }

    const data = await response.json();
    return extractData<RevenueReport>(data);
  } catch (error) {
    console.error('Revenue report error:', error);
    throw error;
  }
};

export const getLeadSourcesReport = async (): Promise<LeadSourceReportItem[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/reports/lead-sources`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch lead sources report');
    }

    const data = await response.json();
    return extractData<LeadSourceReportItem[]>(data);
  } catch (error) {
    console.error('Lead sources report error:', error);
    throw error;
  }
};

export const getPropertyTypesReport = async (): Promise<PropertyTypeReportItem[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/reports/property-types`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch property types report');
    }

    const data = await response.json();
    return extractData<PropertyTypeReportItem[]>(data);
  } catch (error) {
    console.error('Property types report error:', error);
    throw error;
  }
};

// Health check
export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch (error) {
    console.error('Backend health check failed:', error);
    return false;
  }
};

// Blog API
export const getBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/blog`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch blog posts');
    }

    const data = await response.json();
    return extractData<BlogPost[]>(data);
  } catch (error) {
    console.error('Blog posts error:', error);
    throw error;
  }
};

export const getBlogPostById = async (id: string): Promise<BlogPost> => {
  try {
    const response = await fetch(`${API_BASE_URL}/blog/${id}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch blog post');
    }

    const data = await response.json();
    return extractData<BlogPost>(data);
  } catch (error) {
    console.error('Blog post error:', error);
    throw error;
  }
};

export const createBlogPost = async (blogData: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt' | 'author' | 'views' | 'likes' | 'commentsCount'>): Promise<BlogPost> => {
  try {
    const response = await fetch(`${API_BASE_URL}/blog`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(blogData),
    });

    if (!response.ok) {
      throw new Error('Failed to create blog post');
    }

    const data = await response.json();
    return extractData<BlogPost>(data);
  } catch (error) {
    console.error('Create blog post error:', error);
    throw error;
  }
};

export const updateBlogPost = async (id: string, blogData: Partial<BlogPost>): Promise<BlogPost> => {
  try {
    const response = await fetch(`${API_BASE_URL}/blog/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(blogData),
    });

    if (!response.ok) {
      throw new Error('Failed to update blog post');
    }

    const data = await response.json();
    return extractData<BlogPost>(data);
  } catch (error) {
    console.error('Update blog post error:', error);
    throw error;
  }
};

export const deleteBlogPost = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/blog/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete blog post');
    }
  } catch (error) {
    console.error('Delete blog post error:', error);
    throw error;
  }
};

export const publishBlogPost = async (id: string): Promise<BlogPost> => {
  try {
    const response = await fetch(`${API_BASE_URL}/blog/${id}/publish`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to publish blog post');
    }

    const data = await response.json();
    return extractData<BlogPost>(data);
  } catch (error) {
    console.error('Publish blog post error:', error);
    throw error;
  }
};

export const unpublishBlogPost = async (id: string): Promise<BlogPost> => {
  try {
    const response = await fetch(`${API_BASE_URL}/blog/${id}/unpublish`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to unpublish blog post');
    }

    const data = await response.json();
    return extractData<BlogPost>(data);
  } catch (error) {
    console.error('Unpublish blog post error:', error);
    throw error;
  }
};

export const archiveBlogPost = async (id: string): Promise<BlogPost> => {
  try {
    const response = await fetch(`${API_BASE_URL}/blog/${id}/archive`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to archive blog post');
    }

    const data = await response.json();
    return extractData<BlogPost>(data);
  } catch (error) {
    console.error('Archive blog post error:', error);
    throw error;
  }
};

export const unarchiveBlogPost = async (id: string): Promise<BlogPost> => {
  try {
    const response = await fetch(`${API_BASE_URL}/blog/${id}/unarchive`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to unarchive blog post');
    }

    const data = await response.json();
    return extractData<BlogPost>(data);
  } catch (error) {
    console.error('Unarchive blog post error:', error);
    throw error;
  }
};
