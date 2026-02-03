import { BlogArticle } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getBlogPosts = async (): Promise<BlogArticle[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/blog/public`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch blog posts');
    }

    const blogPosts = await response.json();
    
    // Transform the admin blog post format to frontend format
    return blogPosts.map((post: any) => ({
      id: post.id,
      date: new Date(post.createdAt).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      category: post.category,
      title: post.title,
      desc: post.excerpt,
      readTime: `${post.readTime} min read`,
      author: {
        name: post.author.name,
        role: 'Admin',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400'
      },
      image: post.featuredImage || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop',
      content: post.content,
      views: post.views,
      likes: post.likes
    }));
  } catch (error) {
    console.error('Blog API error:', error);
    throw error;
  }
};

export const getBlogPostById = async (id: string): Promise<BlogArticle> => {
  try {
    const response = await fetch(`${API_BASE_URL}/blog/public/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch blog post');
    }

    const post = await response.json();
    
    // Transform the admin blog post format to frontend format
    return {
      id: post.id,
      date: new Date(post.createdAt).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      category: post.category,
      title: post.title,
      desc: post.excerpt,
      readTime: `${post.readTime} min read`,
      author: {
        name: post.author.name,
        role: 'Admin',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400'
      },
      image: post.featuredImage || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop',
      content: post.content,
      views: post.views,
      likes: post.likes
    };
  } catch (error) {
    console.error('Blog post API error:', error);
    throw error;
  }
};

export const getBlogPostsByCategory = async (category: string): Promise<BlogArticle[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/blog/public/category/${category}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch blog posts by category');
    }

    const blogPosts = await response.json();
    
    // Transform the admin blog post format to frontend format
    return blogPosts.map((post: any) => ({
      id: post.id,
      date: new Date(post.createdAt).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      category: post.category,
      title: post.title,
      desc: post.excerpt,
      readTime: `${post.readTime} min read`,
      author: {
        name: post.author.name,
        role: 'Admin',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400'
      },
      image: post.featuredImage || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop',
      content: post.content,
      views: post.views,
      likes: post.likes
    }));
  } catch (error) {
    console.error('Blog API error:', error);
    throw error;
  }
};

export const incrementBlogViews = async (id: string): Promise<number> => {
  try {
    const response = await fetch(`${API_BASE_URL}/blog/public/${id}/views`, {
      method: 'PATCH',
    });
    
    if (!response.ok) {
      throw new Error('Failed to increment blog views');
    }

    const data = await response.json();
    return data.views;
  } catch (error) {
    console.error('Blog API error:', error);
    throw error;
  }
};

export const incrementBlogLikes = async (id: string): Promise<number> => {
  try {
    const response = await fetch(`${API_BASE_URL}/blog/public/${id}/likes`, {
      method: 'PATCH',
    });
    
    if (!response.ok) {
      throw new Error('Failed to increment blog likes');
    }

    const data = await response.json();
    return data.likes;
  } catch (error) {
    console.error('Blog API error:', error);
    throw error;
  }
};
