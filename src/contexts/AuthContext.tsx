
import React, { createContext, useState, useContext, useEffect } from 'react';
import { User } from '@/types';
import { users } from '@/lib/mock-data';
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: 'organizer' | 'participant') => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  login: async () => false,
  register: async () => false,
  logout: () => {},
  isAuthenticated: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const { toast } = useToast();
  
  // Check if user is logged in from localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  // Mock login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // In a real app, this would make an API request
      // For now we'll just check our mock data
      const user = users.find(u => u.email === email);
      
      // Simulate a delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (user) {
        setCurrentUser(user);
        setIsAuthenticated(true);
        localStorage.setItem('currentUser', JSON.stringify(user));
        toast({
          title: "Login successful",
          description: `Welcome back, ${user.name}!`,
        });
        return true;
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login error",
        description: "An error occurred during login",
        variant: "destructive",
      });
      return false;
    }
  };

  // Mock register function
  const register = async (
    name: string, 
    email: string, 
    password: string, 
    role: 'organizer' | 'participant'
  ): Promise<boolean> => {
    try {
      // In a real app, this would make an API request
      // For now we'll just simulate a successful registration
      
      // Check if email already exists
      const exists = users.some(u => u.email === email);
      
      if (exists) {
        toast({
          title: "Registration failed",
          description: "Email already in use",
          variant: "destructive",
        });
        return false;
      }
      
      // Simulate a delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Create a new user
      const newUser: User = {
        id: `user${users.length + 1}`,
        name,
        email,
        role,
      };
      
      // In a real app, we would save this to the database
      // For now, we just update our in-memory data
      users.push(newUser);
      
      setCurrentUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      
      toast({
        title: "Registration successful",
        description: `Welcome to SJSU Event Nexus, ${name}!`,
      });
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration error",
        description: "An error occurred during registration",
        variant: "destructive",
      });
      return false;
    }
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
