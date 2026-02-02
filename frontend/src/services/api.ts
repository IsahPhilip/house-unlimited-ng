import { Property, Review, User, AuthResponse } from '../types';

const API_BASE_URL = 'http://localhost:3000/api';

// Properties API
export const getProperties = async (): Promise<Property[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/properties`);
    if (!response.ok) {
      throw new Error('Failed to fetch properties');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching properties:', error);
    return []; // Return empty array as fallback
  }
};

export const getPropertyById = async (id: number): Promise<Property | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/properties/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch property');
    }
    return await response.json();
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
    return await response.json();
  } catch (error) {
    console.error('Error fetching featured properties:', error);
    return [];
  }
};

// Reviews API
export const getReviewsByPropertyId = async (propertyId: number): Promise<Review[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/reviews?propertyId=${propertyId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch reviews');
    }
    return await response.json();
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
      },
      body: JSON.stringify(reviewData),
    });
    if (!response.ok) {
      throw new Error('Failed to add review');
    }
    return await response.json();
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
    return result.data;
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
    return result.data;
  } catch (error) {
    console.error('Registration error:', error);
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
