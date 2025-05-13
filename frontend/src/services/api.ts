
import axios from 'axios';
import { AuthResponse, Post, User, Comment } from "@/types";

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor for adding auth token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  error => Promise.reject(error)
);

export const apiService = {
  auth: {
    login: async (email: string, password: string): Promise<AuthResponse> => {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    },
    
    register: async (username: string, name: string, email: string, password: string): Promise<AuthResponse> => {
      const response = await api.post('/auth/register', { username, name, email, password });
      return response.data;
    },
    
    getCurrentUser: async (): Promise<User> => {
      const response = await api.get('/auth/current');
      return response.data;
    },
  },
  
  posts: {
    getPosts: async (page = 1, limit = 10): Promise<Post[]> => {
      const response = await api.get(`/posts?page=${page}&limit=${limit}`);
      return response.data;
    },
    
    getPost: async (id: string): Promise<Post> => {
      const response = await api.get(`/posts/${id}`);
      return response.data;
    },
    
    createPost: async (formData: FormData): Promise<Post> => {
      const response = await api.post('/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    },
    
    likePost: async (id: string): Promise<{ likes: number }> => {
      const response = await api.post(`/posts/${id}/like`);
      return response.data;
    },
    
    unlikePost: async (id: string): Promise<{ likes: number }> => {
      const response = await api.post(`/posts/${id}/unlike`);
      return response.data;
    },
    
    deletePost: async (id: string): Promise<void> => {
      await api.delete(`/posts/${id}`);
    },
    
    getComments: async (postId: string): Promise<Comment[]> => {
      const response = await api.get(`/posts/${postId}/comments`);
      return response.data;
    },
    
    addComment: async (postId: string, content: string): Promise<Comment> => {
      const response = await api.post(`/posts/${postId}/comments`, { content });
      return response.data;
    }
  },
  
  users: {
    getSuggestedUsers: async (): Promise<User[]> => {
      const response = await api.get('/users/suggested');
      return response.data;
    },
    
    followUser: async (id: string): Promise<void> => {
      await api.post(`/users/${id}/follow`);
    },
    
    unfollowUser: async (id: string): Promise<void> => {
      await api.post(`/users/${id}/unfollow`);
    },
    
    getUserProfile: async (username: string): Promise<User> => {
      const response = await api.get(`/users/${username}`);
      return response.data;
    },
    
    getUserPosts: async (userId: string, page = 1, limit = 10): Promise<Post[]> => {
      const response = await api.get(`/users/${userId}/posts?page=${page}&limit=${limit}`);
      return response.data;
    },
  },
  
  profile: {
    getProfile: async (): Promise<User> => {
      const response = await api.get('/profile/me');
      return response.data;
    },
    
    updateProfile: async (data: { name?: string; bio?: string; location?: string }): Promise<User> => {
      const response = await api.put('/profile', data);
      return response.data;
    },
    
    uploadAvatar: async (file: File): Promise<User> => {
      const formData = new FormData();
      formData.append('avatar', file);
      
      const response = await api.put('/profile/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    }
  }
};
