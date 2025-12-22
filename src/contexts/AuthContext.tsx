import { auth } from '@/firebaseConfig'; // Ensure this path is correct
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface AuthContextType {
  user: any;
  login: (user?: any) => void;
  logout: () => void;
  updateUser: (user?: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 1. Listen for Firebase Auth State Changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/${firebaseUser.uid}`);
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            console.error("User logged in Firebase but not found in Backend");
            setUser(null);
          }
        } catch (error) {
          console.error("Backend fetch error:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = (userData?: any) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await auth.signOut();
      setUser(null);
      console.log("Logged out successfully"); 
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const updateUser = (userData?: any) => {
    setUser(userData);
  };

  const value = {
    user,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};