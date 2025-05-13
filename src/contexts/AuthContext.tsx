
import { AuthResponse, User } from "@/types";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/services/api";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Check if user is logged in on initial load
  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (token) {
      api.auth.getCurrentUser()
        .then(userData => {
          setUser(userData);
        })
        .catch(error => {
          console.error("Error fetching user:", error);
          localStorage.removeItem("token");
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const response = await api.auth.login(email, password);
      setUser(response.user);
      localStorage.setItem("token", response.token);
      toast({
        title: "Login successful",
        description: `Welcome back, ${response.user.name}!`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error instanceof Error ? error.message : "An error occurred during login",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const response = await api.auth.register(username, email, password);
      setUser(response.user);
      localStorage.setItem("token", response.token);
      toast({
        title: "Registration successful",
        description: `Welcome, ${response.user.name}!`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error instanceof Error ? error.message : "An error occurred during registration",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
