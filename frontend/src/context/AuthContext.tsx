import React, { createContext, useState, useEffect, useContext } from 'react';
import { TokenStorage } from '../storage/tokenStorage';
import { AuthService } from '../service/authService';
import { UserService } from '../service/userService';
import { AuthRequest } from '../types/auth';
import { UserProfileResponse } from '../types/user';

interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  user: UserProfileResponse | null;
  login: (credentials: AuthRequest) => Promise<UserProfileResponse | null>;
  logout: () => Promise<void>;
  checkLoginStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const token = await TokenStorage.getAccessToken();
      
      if (token) {
        await AuthService.refreshAccessToken();
        const userProfile = await UserService.getDetails();
        setUser(userProfile);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    } catch (error) {
      console.log("Sesja wygasła lub błąd pobierania profilu");
      setIsLoggedIn(false);
      setUser(null);
      await TokenStorage.clearTokens();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: AuthRequest): Promise<UserProfileResponse | null> => {
    await AuthService.login(credentials);
    const userProfile = await UserService.getDetails();
    setUser(userProfile);
    setIsLoggedIn(true);
    return userProfile;
  };

  const logout = async () => {
    await AuthService.logout();
    TokenStorage.clearTokens();
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading, user, login, logout, checkLoginStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);