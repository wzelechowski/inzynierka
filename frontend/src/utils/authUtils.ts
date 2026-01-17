import { jwtDecode } from "jwt-decode";

interface KeycloakToken {
  sub: string;
  name?: string;
  preferred_username?: string;
  realm_access?: {
    roles: string[];
  };
  resource_access?: {
    [key: string]: {
      roles: string[];
    };
  };
}

export const decodeToken = (token: string): KeycloakToken | null => {
  try {
    return jwtDecode<KeycloakToken>(token);
  } catch (error) {
    return null;
  }
};

export const hasRole = (token: string | null, role: string): boolean => {
  if (!token) return false;
  
  const decoded = decodeToken(token);
  if (!decoded) return false;

  if (decoded.realm_access?.roles?.includes(role)) return true;

  const appClientId = 'pizzeria-app'; 
  if (decoded.resource_access?.[appClientId]?.roles?.includes(role)) return true;
  
  if (decoded.resource_access?.['realm-management']?.roles?.includes(role)) return true;

  return false;
};

export const isSupplier = (token: string | null) => hasRole(token, 'SUPPLIER');
export const isAdmin = (token: string | null) => hasRole(token, 'manage-users');