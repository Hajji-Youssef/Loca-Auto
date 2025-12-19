
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../types';

interface UserCredential {
  email: string;
  password: string;
  fullName: string;
}

const DEFAULT_PASSWORD = "123456";

// Identifiants par défaut pour le staff interne
const INTERNAL_STAFF: UserCredential[] = [
  { email: "admin@locaauto.com", password: DEFAULT_PASSWORD, fullName: "Direction Générale" },
  { email: "worker-agence@locaauto.com", password: DEFAULT_PASSWORD, fullName: "Responsable Flotte" }
];

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (email: string, fullName: string, password: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isWorker: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [credentials, setCredentials] = useState<UserCredential[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('locaauto_user');
    if (storedUser) setUser(JSON.parse(storedUser));

    const storedCreds = localStorage.getItem('locaauto_db_creds');
    if (storedCreds) {
      setCredentials(JSON.parse(storedCreds));
    } else {
      setCredentials(INTERNAL_STAFF);
      localStorage.setItem('locaauto_db_creds', JSON.stringify(INTERNAL_STAFF));
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    const lowerEmail = email.toLowerCase().trim();
    const found = credentials.find(c => c.email === lowerEmail && c.password === password);
    
    if (!found) return false;

    // RÈGLES DE RÔLES STRICTES :
    // - Doit finir par @locaauto.com pour être STAFF
    // - Si contient "admin" -> ADMIN
    // - Si contient "worker" -> WORKER
    // - Sinon -> CLIENT
    let role: 'CLIENT' | 'WORKER' | 'ADMIN' = 'CLIENT';
    
    if (lowerEmail.endsWith('@locaauto.com')) {
        if (lowerEmail.includes('admin')) {
            role = 'ADMIN';
        } else if (lowerEmail.includes('worker')) {
            role = 'WORKER';
        }
    }
    
    const mockUser: User = {
      id: Math.floor(Math.random() * 10000),
      fullName: found.fullName,
      email: lowerEmail,
      role: role,
      isOnline: true,
      token: "session-" + Math.random().toString(36).substring(7)
    };

    setUser(mockUser);
    localStorage.setItem('locaauto_user', JSON.stringify(mockUser));
    return true;
  };

  const register = (email: string, fullName: string, password: string) => {
    const lowerEmail = email.toLowerCase().trim();
    if (!credentials.some(c => c.email === lowerEmail)) {
      const newList = [...credentials, { email: lowerEmail, fullName, password }];
      setCredentials(newList);
      localStorage.setItem('locaauto_db_creds', JSON.stringify(newList));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('locaauto_user');
  };

  const isWorker = user?.role === 'WORKER' || user?.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      isAuthenticated: !!user, 
      isWorker 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
