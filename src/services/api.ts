
import { AuthResponse, Post, User } from "@/types";

// This is a mock API service for now
// In a real app, we would connect to a backend API

const BASE_URL = "/api";

// Mock data
const currentUser: User = {
  _id: "1",
  username: "cyndy_lillibridge",
  name: "Cyndy Lillibridge",
  email: "cyndy@example.com",
  bio: "Living life to the fullest",
  avatar: "/placeholder.svg",
  location: "Torrance, CA, United States",
  followers: 184300,
  following: 1040000,
  posts: 368,
  createdAt: "2023-01-01T00:00:00.000Z",
  updatedAt: "2023-01-01T00:00:00.000Z",
};

const samplePosts: Post[] = [
  {
    _id: "1",
    content: "While Corfu gives us the ability to shoot by the sea with amazing blue background full of light of the sky, Florina gives us its gentle side. The humble atmosphere and Light of Florina which comes...",
    images: ["/placeholder.svg"],
    author: currentUser,
    likes: 1600,
    comments: 230,
    hasLiked: false,
    tags: ["landscape", "flora", "nature"],
    createdAt: "2023-05-12T14:32:00.000Z",
    updatedAt: "2023-05-12T14:32:00.000Z",
  },
  {
    _id: "2",
    content: "Exploring new places this weekend! Who wants to join?",
    images: ["/placeholder.svg"],
    author: {
      ...currentUser,
      _id: "2",
      username: "dianne_russell",
      name: "Dianne Russell",
    },
    likes: 890,
    comments: 45,
    hasLiked: true,
    createdAt: "2023-05-10T10:24:00.000Z",
    updatedAt: "2023-05-10T10:24:00.000Z",
  }
];

const suggestedUsers: User[] = [
  {
    _id: "3",
    username: "chantal_shelburne",
    name: "Chantal Shelburne",
    email: "chantal@example.com",
    avatar: "/placeholder.svg",
    location: "Memphis, TN, US",
    followers: 12400,
    following: 435,
    posts: 57,
    createdAt: "2023-02-15T00:00:00.000Z",
    updatedAt: "2023-02-15T00:00:00.000Z",
  },
  {
    _id: "4",
    username: "marci_senter",
    name: "Marci Senter",
    email: "marci@example.com",
    avatar: "/placeholder.svg",
    location: "Newark, NJ, US",
    followers: 8900,
    following: 523,
    posts: 43,
    createdAt: "2023-03-20T00:00:00.000Z",
    updatedAt: "2023-03-20T00:00:00.000Z",
  },
  {
    _id: "5",
    username: "janetta_rotolo",
    name: "Janetta Rotolo",
    email: "janetta@example.com",
    avatar: "/placeholder.svg",
    location: "Fort Worth, TX, US",
    followers: 10300,
    following: 367,
    posts: 72,
    createdAt: "2023-01-08T00:00:00.000Z",
    updatedAt: "2023-01-08T00:00:00.000Z",
  },
];

export const api = {
  auth: {
    login: async (email: string, password: string): Promise<AuthResponse> => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email !== "test@example.com" || password !== "password") {
        throw new Error("Invalid credentials");
      }
      
      return {
        user: currentUser,
        token: "mock-jwt-token",
      };
    },
    
    register: async (username: string, email: string, password: string): Promise<AuthResponse> => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        user: {
          ...currentUser,
          username,
          email,
        },
        token: "mock-jwt-token",
      };
    },
    
    getCurrentUser: async (): Promise<User> => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return currentUser;
    },
  },
  
  posts: {
    getPosts: async (page = 1, limit = 10): Promise<Post[]> => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return samplePosts;
    },
    
    getPost: async (id: string): Promise<Post> => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const post = samplePosts.find(p => p._id === id);
      if (!post) throw new Error("Post not found");
      
      return post;
    },
    
    createPost: async (content: string, image?: File): Promise<Post> => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      return {
        _id: Math.random().toString(36).substring(7),
        content,
        images: image ? [URL.createObjectURL(image)] : [],
        author: currentUser,
        likes: 0,
        comments: 0,
        hasLiked: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    },
    
    likePost: async (id: string): Promise<void> => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // In a real app, we would update the post in the state
    },
    
    unlikePost: async (id: string): Promise<void> => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // In a real app, we would update the post in the state
    },
    
    deletePost: async (id: string): Promise<void> => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In a real app, we would remove the post from the state
    },
  },
  
  users: {
    getSuggestedUsers: async (): Promise<User[]> => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 700));
      
      return suggestedUsers;
    },
    
    followUser: async (id: string): Promise<void> => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app, we would update the user in the state
    },
    
    unfollowUser: async (id: string): Promise<void> => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app, we would update the user in the state
    },
    
    getUserProfile: async (username: string): Promise<User> => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 600));
      
      if (username === currentUser.username) {
        return currentUser;
      }
      
      const user = suggestedUsers.find(u => u.username === username);
      if (!user) throw new Error("User not found");
      
      return user;
    },
    
    updateProfile: async (data: Partial<User>): Promise<User> => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        ...currentUser,
        ...data,
        updatedAt: new Date().toISOString(),
      };
    },
  },
};
