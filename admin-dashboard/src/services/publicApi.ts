import { BlogPost } from '../types/admin';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Public API endpoints (no authentication required)
export const getPublicBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/blog/public`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch blog posts');
    }

    return await response.json();
  } catch (error) {
    console.error('Public blog posts error:', error);
    throw error;
  }
};

export const getPublicBlogPostById = async (id: string): Promise<BlogPost> => {
  try {
    const response = await fetch(`${API_BASE_URL}/blog/public/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch blog post');
    }

    return await response.json();
  } catch (error) {
    console.error('Public blog post error:', error);
    throw error;
  }
};
