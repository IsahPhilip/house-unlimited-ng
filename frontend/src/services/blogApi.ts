import { BlogArticle } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface BlogPagination {
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  limit: number;
}

export const getBlogPosts = async (page = 1, limit = 9): Promise<{ posts: BlogArticle[]; pagination: BlogPagination }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/blog/public?page=${page}&limit=${limit}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch blog posts');
    }

    const blogResponse = await response.json();
    const blogPosts = Array.isArray(blogResponse) ? blogResponse : blogResponse.posts;
    
    // Transform the admin blog post format to frontend format
    const posts = blogPosts.map((post: any) => ({
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
        name: post.author?.name,
        role: post.author?.role,
        image: post.author?.avatar,
        bio: post.author?.bio
      },
      image: post.featuredImage || undefined,
      content: post.content,
      views: post.views,
      likes: post.likes
    }));

    return {
      posts,
      pagination: blogResponse.pagination || {
        currentPage: page,
        totalPages: 1,
        totalPosts: posts.length,
        limit,
      },
    };
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
        name: post.author?.name,
        role: post.author?.role,
        image: post.author?.avatar,
        bio: post.author?.bio
      },
      image: post.featuredImage || undefined,
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
        name: post.author?.name,
        role: post.author?.role,
        image: post.author?.avatar,
        bio: post.author?.bio
      },
      image: post.featuredImage || undefined,
      content: post.content,
      views: post.views,
      likes: post.likes
    }));
  } catch (error) {
    console.error('Blog API error:', error);
    throw error;
  }
};

export const getRelatedBlogPosts = async (id: string, limit = 3): Promise<BlogArticle[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/blog/public/${id}/related?limit=${limit}`);

    if (!response.ok) {
      throw new Error('Failed to fetch related blog posts');
    }

    const blogPosts = await response.json();

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
        name: post.author?.name,
        role: post.author?.role,
        image: post.author?.avatar,
        bio: post.author?.bio
      },
      image: post.featuredImage || undefined,
      content: post.content,
      views: post.views,
      likes: post.likes
    }));
  } catch (error) {
    console.error('Related blog API error:', error);
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
