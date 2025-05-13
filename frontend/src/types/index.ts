
export interface User {
  _id: string;
  username: string;
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
  location?: string;
  followers: number;
  following: number;
  posts: number;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  _id: string;
  content: string;
  images?: string[];
  author: User;
  likes: number;
  comments: number;
  hasLiked?: boolean;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  content: string;
  author: User;
  post: string;
  likes: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
