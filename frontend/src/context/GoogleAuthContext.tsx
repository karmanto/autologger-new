import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { googleLogout, CredentialResponse } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

interface GoogleUser {
  name: string;
  email: string;
  picture: string;
}

interface GoogleAuthContextType {
  user: GoogleUser | null;
  isLoggedIn: boolean;
  logout: () => void;
  handleCredentialResponse: (response: CredentialResponse) => void;
}

const GoogleAuthContext = createContext<GoogleAuthContextType | undefined>(undefined);

export const useGoogleAuth = () => {
  const context = useContext(GoogleAuthContext);
  if (!context) {
    throw new Error('useGoogleAuth must be used within a GoogleAuthProvider');
  }
  return context;
};

export const GoogleAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<GoogleUser | null>(() => {
    const storedUser = localStorage.getItem('googleUser');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const isLoggedIn = !!user;

  const handleCredentialResponse = useCallback((response: CredentialResponse) => {
    if (response.credential) {
      try {
        const decoded: any = jwtDecode(response.credential);
        const userData: GoogleUser = {
          name: decoded.name,
          email: decoded.email,
          picture: decoded.picture,
        };
        setUser(userData);
        localStorage.setItem('googleUser', JSON.stringify(userData));
      } catch (error) {
        console.error("Failed to decode JWT:", error);
      }
    }
  }, []);

  const logout = useCallback(() => {
    googleLogout();
    setUser(null);
    localStorage.removeItem('googleUser');
  }, []);

  return (
    <GoogleAuthContext.Provider value={{ user, isLoggedIn, logout, handleCredentialResponse }}>
      {children}
    </GoogleAuthContext.Provider>
  );
};
