import { User, Property, Review, Lead, Deal, Agent, DashboardStats, ApiResponse, BlogPost } from '../types/admin';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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

    return data;
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

    return await response.json();
  } catch (error) {
    console.error('Get user error:', error);
    throw error;
  }
};

// Dashboard API
export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch dashboard stats');
    }

    return await response.json();
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

    return await response.json();
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

    return await response.json();
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

    return await response.json();
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

    return await response.json();
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

    return await response.json();
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

    return await response.json();
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

    return await response.json();
  } catch (error) {
    console.error('Reviews error:', error);
    throw error;
  }
};

// Leads API
export const getLeads = async (): Promise<Lead[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/leads`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch leads');
    }

    return await response.json();
  } catch (error) {
    console.error('Leads error:', error);
    throw error;
  }
};

export const createLead = async (leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Promise<Lead> => {
  try {
    const response = await fetch(`${API_BASE_URL}/leads`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(leadData),
    });

    if (!response.ok) {
      throw new Error('Failed to create lead');
    }

    return await response.json();
  } catch (error) {
    console.error('Create lead error:', error);
    throw error;
  }
};

// Deals API
export const getDeals = async (): Promise<Deal[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/deals`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch deals');
    }

    return await response.json();
  } catch (error) {
    console.error('Deals error:', error);
    throw error;
  }
};

// Agents API
export const getAgents = async (): Promise<Agent[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/agents`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch agents');
    }

    return await response.json();
  } catch (error) {
    console.error('Agents error:', error);
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

    return await response.json();
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

    return await response.json();
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

    return await response.json();
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

    return await response.json();
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

    return await response.json();
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

    return await response.json();
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

    return await response.json();
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

    return await response.json();
  } catch (error) {
    console.error('Unarchive blog post error:', error);
    throw error;
  }
};
