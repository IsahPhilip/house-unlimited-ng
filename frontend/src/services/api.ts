import { Property, Review, User } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Properties API
export const getProperties = async (page?: number, limit?: number): Promise<any> => {
  try {
    const params = new URLSearchParams();
    if (page) params.set('page', String(page));
    if (limit) params.set('limit', String(limit));
    const query = params.toString();
    const response = await fetch(`${API_BASE_URL}/properties${query ? `?${query}` : ''}`);
    if (!response.ok) {
      throw new Error('Failed to fetch properties');
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching properties:', error);
    return { data: [], pagination: null };
  }
};

export const getPropertyById = async (id: string): Promise<Property | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/properties/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch property');
    }
    const result = await response.json();
    return result.data || result;
  } catch (error) {
    console.error('Error fetching property:', error);
    return null;
  }
};

export const getFeaturedProperties = async (): Promise<Property[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/properties/featured`);
    if (!response.ok) {
      throw new Error('Failed to fetch featured properties');
    }
    const result = await response.json();
    return result.data || result;
  } catch (error) {
    console.error('Error fetching featured properties:', error);
    return [];
  }
};

// Reviews API
export const getReviewsByPropertyId = async (propertyId: string): Promise<Review[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/reviews/property/${propertyId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch reviews');
    }
    const result = await response.json();
    return result.data || result;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
};

export const addReview = async (reviewData: Omit<Review, 'id' | 'date'>): Promise<Review> => {
  try {
    const response = await fetch(`${API_BASE_URL}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(localStorage.getItem('authToken') ? { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` } : {}),
      },
      body: JSON.stringify(reviewData),
    });
    if (!response.ok) {
      throw new Error('Failed to add review');
    }
    const result = await response.json();
    return result.data || result;
  } catch (error) {
    console.error('Error adding review:', error);
    throw error;
  }
};

// Auth API
export const login = async (email: string, password: string): Promise<User & { token: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      throw new Error('Login failed');
    }
    const result = await response.json();
    return { ...result.data, token: result.token };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const register = async (userData: Omit<User, 'id'> & { password: string }): Promise<User & { token: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      throw new Error('Registration failed');
    }
    const result = await response.json();
    return { ...result.data, token: result.token };
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Profile API
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Get user error:', error);
    throw error;
  }
};

export const updateProfile = async (updates: Partial<User>): Promise<User> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });
    if (!response.ok) {
      throw new Error('Failed to update profile');
    }
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Update profile error:', error);
    throw error;
  }
};

// Wishlist API
export const getWishlist = async (): Promise<Property[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/wishlist`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch wishlist');
    }
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Get wishlist error:', error);
    return [];
  }
};

export const addToWishlist = async (propertyId: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/users/wishlist/${propertyId}`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to add to wishlist');
  }
};

export const removeFromWishlist = async (propertyId: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/users/wishlist/${propertyId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to remove from wishlist');
  }
};

export const getMyReviews = async (): Promise<Review[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/reviews/user/me`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch user reviews');
    }
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Get user reviews error:', error);
    return [];
  }
};

// Public media API
export const getPublicMedia = async (): Promise<Array<{ type: 'image' | 'video'; title: string; url: string }>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/public/media`);
    if (!response.ok) {
      throw new Error('Failed to fetch media');
    }
    const result = await response.json();
    return result.data || result || [];
  } catch (error) {
    console.error('Error fetching media:', error);
    return [];
  }
};

// Avatar upload
export const uploadAvatar = async (file: File): Promise<User> => {
  try {
    const token = localStorage.getItem('authToken');
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await fetch(`${API_BASE_URL}/users/avatar`, {
      method: 'POST',
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      body: formData,
    });
    if (!response.ok) {
      throw new Error('Failed to upload avatar');
    }
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Upload avatar error:', error);
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
