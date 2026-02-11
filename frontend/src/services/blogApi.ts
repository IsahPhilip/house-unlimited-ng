import { BlogArticle, BlogComment } from '../types';

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
      likes: post.likes,
      commentsCount: post.commentsCount
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
      likes: post.likes,
      commentsCount: post.commentsCount
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
      likes: post.likes,
      commentsCount: post.commentsCount
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
      likes: post.likes,
      commentsCount: post.commentsCount
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

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const getBlogComments = async (id: string): Promise<BlogComment[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/blog/public/${id}/comments`);

    if (!response.ok) {
      throw new Error('Failed to fetch blog comments');
    }

    return await response.json();
  } catch (error) {
    console.error('Blog comments API error:', error);
    throw error;
  }
};

export const addBlogComment = async (id: string, content: string): Promise<BlogComment> => {
  try {
    const response = await fetch(`${API_BASE_URL}/blog/public/${id}/comments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      throw new Error('Failed to add blog comment');
    }

    return await response.json();
  } catch (error) {
    console.error('Blog comments API error:', error);
    throw error;
  }
};

export const updateBlogComment = async (commentId: string, content: string): Promise<BlogComment> => {
  try {
    const response = await fetch(`${API_BASE_URL}/blog/public/comments/${commentId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      throw new Error('Failed to update blog comment');
    }

    return await response.json();
  } catch (error) {
    console.error('Blog comments API error:', error);
    throw error;
  }
};

export const deleteBlogComment = async (commentId: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/blog/public/comments/${commentId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete blog comment');
    }
  } catch (error) {
    console.error('Blog comments API error:', error);
    throw error;
  }
};

export const getBlogInteraction = async (id: string): Promise<{ liked: boolean; bookmarked: boolean }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/blog/public/${id}/interaction`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch blog interaction');
    }

    return await response.json();
  } catch (error) {
    console.error('Blog interaction API error:', error);
    throw error;
  }
};

export const likeBlogPost = async (id: string): Promise<{ liked: boolean; likes: number }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/blog/public/${id}/like`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to like blog post');
    }

    return await response.json();
  } catch (error) {
    console.error('Blog like API error:', error);
    throw error;
  }
};

export const unlikeBlogPost = async (id: string): Promise<{ liked: boolean; likes: number }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/blog/public/${id}/like`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to unlike blog post');
    }

    return await response.json();
  } catch (error) {
    console.error('Blog like API error:', error);
    throw error;
  }
};

export const bookmarkBlogPost = async (id: string): Promise<{ bookmarked: boolean }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/blog/public/${id}/bookmark`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to bookmark blog post');
    }

    return await response.json();
  } catch (error) {
    console.error('Blog bookmark API error:', error);
    throw error;
  }
};

export const unbookmarkBlogPost = async (id: string): Promise<{ bookmarked: boolean }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/blog/public/${id}/bookmark`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to remove blog bookmark');
    }

    return await response.json();
  } catch (error) {
    console.error('Blog bookmark API error:', error);
    throw error;
  }
};
