import React, { createContext, useState, useEffect, useContext } from 'react';
import { TokenStorage } from '../storage/tokenStorage';
import { AuthService } from '../service/authService';
import { AuthRequest } from '../types/auth';

interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (credentials: AuthRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const token = await TokenStorage.getAccessToken();
      
      if (token) {
        await AuthService.refreshAccessToken();
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.log("Sesja wygasła przy starcie aplikacji");
      setIsLoggedIn(false);
      await TokenStorage.clearTokens();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: AuthRequest) => {
    await AuthService.login(credentials);
    setIsLoggedIn(true);
  };

  const logout = async () => {
    await AuthService.logout();
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);