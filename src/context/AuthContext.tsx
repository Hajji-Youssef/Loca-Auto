import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../types';

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
    // LOGIQUE DE SIMULATION :
    // Detection du rôle basé sur le contenu de l'email
    const lowerEmail = email.toLowerCase();
    let role: 'CLIENT' | 'WORKER' | 'ADMIN' = 'CLIENT';
    let fullName = "Jean Dupont";

    if (lowerEmail.includes('admin')) {
        role = 'ADMIN';
        fullName = "Administrateur Système";
    } else if (lowerEmail.includes('worker')) {
        role = 'WORKER';
        fullName = "Agent LocaAuto";
    }
    
    const mockUser: User = {
      id: role === 'CLIENT' ? 1 : (role === 'ADMIN' ? 100 : 99),
      fullName: fullName,
      email: email,
      role: role,
      isOnline: true,
      token: "mock-token-xyz"
    };

    setUser(mockUser);
    localStorage.setItem('locaauto_user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('locaauto_user');
  };

  // Restauration de la session au rechargement de la page
  useEffect(() => {
    const stored = localStorage.getItem('locaauto_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  // Le bouton "Espace Agence" s'affiche pour les Workers ET les Admins
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