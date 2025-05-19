import { router } from 'expo-router';
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
  // New fields
  employmentStatus: {
    status: 'employed' | 'unemployed' | 'student' | 'freelancer';
    details?: string;
    currentEmployer?: string;
    position?: string;
    employmentSince?: string;
  };
  linkedIn?: string;
  skills: Array<{
    name: string;
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    graduationYear: string;
  }>;
  jobPreferences: {
    desiredRole?: string;
    desiredSalary?: string;
    desiredLocation?: string;
    workType?: 'full-time' | 'part-time' | 'freelance' | 'remote' | 'hybrid';
    availableFrom?: string;
  };
  languages: Array<{
    name: string;
    level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'native';
  }>;
  favoritedJobs: Array<{
    id: string;
    title: string;
    company: string;
    location: string;
    dateAdded: string;
  }>;
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
  username: 'csbe',
  name: 'Abuzittin Kodyazar',
  email: 'dev@mail.be',
  phoneNumber: '+32 123 456 789',
  address: 'Korenmarkt 1, 9000 Gent',
  profilePicture: 'https://randomuser.me/api/portraits/lego/1.jpg',
  // New dummy data
  employmentStatus: {
    status: 'employed',
    details: 'Working as a senior developer',
    currentEmployer: 'CodeSapiens',
    position: 'Senior Full Stack Developer',
    employmentSince: '2021-06-15',
  },
  linkedIn: 'https://linkedin.com/in/codesapienbe',
  skills: [
    { name: 'JavaScript', level: 'expert' },
    { name: 'React', level: 'advanced' },
    { name: 'Node.js', level: 'advanced' },
    { name: 'SQL', level: 'intermediate' },
    { name: 'Docker', level: 'beginner' },
  ],
  education: [
    {
      institution: 'Ghent University',
      degree: 'Master',
      field: 'Computer Science',
      graduationYear: '2019',
    },
    {
      institution: 'Hogeschool Gent',
      degree: 'Bachelor',
      field: 'Applied Informatics',
      graduationYear: '2017',
    },
  ],
  jobPreferences: {
    desiredRole: 'Tech Lead',
    desiredSalary: '€65,000 - €75,000',
    desiredLocation: 'Ghent or Remote',
    workType: 'hybrid',
    availableFrom: '2023-12-01',
  },
  languages: [
    { name: 'Dutch', level: 'native' },
    { name: 'English', level: 'C2' },
    { name: 'French', level: 'B1' },
    { name: 'German', level: 'A2' },
  ],
  favoritedJobs: [
    {
      id: '1',
      title: 'Senior Frontend Developer',
      company: 'TechCorp Belgium',
      location: 'Ghent',
      dateAdded: '2024-03-15',
    },
    {
      id: '2',
      title: 'Full Stack Developer',
      company: 'Digital Solutions',
      location: 'Brussels',
      dateAdded: '2024-03-10',
    },
  ],
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
    // Redirect to login screen after logout
    router.replace('/login');
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