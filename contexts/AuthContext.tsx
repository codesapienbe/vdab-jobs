import React, { createContext, ReactNode, useContext, useState } from 'react';

// Define the User type
export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  profilePicture?: string;
}

// Define the AuthContext type
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Create the dummy user
const dummyUser: User = {
  id: '1',
  username: 'demo',
  name: 'Demo User',
  email: 'demo@example.com',
  phoneNumber: '+32 123 456 789',
  address: 'Korenmarkt 1, 9000 Gent',
  profilePicture: 'https://randomuser.me/api/portraits/lego/1.jpg',
};

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  login: () => Promise.resolve(false),
  logout: () => {},
});

// Create the AuthProvider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Login function
  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        if (username === 'demo' && password === 'demo') {
          setUser(dummyUser);
          setIsLoading(false);
          resolve(true);
        } else {
          setUser(null);
          setIsLoading(false);
          resolve(false);
        }
      }, 1000); // Simulate network delay
    });
  };

  // Logout function
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the AuthContext
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 