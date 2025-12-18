
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../types';

// RÉGLAGES DE SÉCURITÉ : Liste blanche des accès privilégiés
const ADMIN_WHITELIST = ["admin@locaauto.com", "admin@gmail.com", "direction@locaauto.com"];
const WORKER_WHITELIST = ["worker@locaauto.com", "agent@locaauto.com", "sophie@locaauto.com"];

interface AuthContextType {
  user: User | null;
  login: (email: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isWorker: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string) => {
    const lowerEmail = email.toLowerCase().trim();
    let role: 'CLIENT' | 'WORKER' | 'ADMIN' = 'CLIENT';
    let fullName = "Utilisateur";

    if (ADMIN_WHITELIST.includes(lowerEmail)) {
        role = 'ADMIN';
        fullName = "Administrateur Système";
    } else if (WORKER_WHITELIST.includes(lowerEmail)) {
        role = 'WORKER';
        fullName = "Agent de Flotte";
    } else {
        role = 'CLIENT';
        fullName = "Client LocaAuto";
    }
    
    const mockUser: User = {
      id: role === 'CLIENT' ? Math.floor(Math.random() * 1000) : (role === 'ADMIN' ? 100 : 99),
      fullName: fullName,
      email: lowerEmail,
      role: role,
      isOnline: true,
      token: "secure-jwt-simulated-" + Math.random().toString(36).substr(2)
    };

    setUser(mockUser);
    localStorage.setItem('locaauto_user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('locaauto_user');
  };

  useEffect(() => {
    const stored = localStorage.getItem('locaauto_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const isWorker = user?.role === 'WORKER' || user?.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isWorker }}>
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
