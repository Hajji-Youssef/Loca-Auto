
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../types';

// RÉGLAGES DE SÉCURITÉ : Liste blanche par défaut (Hardcoded)
const ADMIN_EMAILS = ["admin@locaauto.com", "admin@gmail.com", "direction@locaauto.com"];
const WORKER_EMAILS = ["worker@locaauto.com", "agent@locaauto.com", "sophie@locaauto.com"];
const INITIAL_CLIENTS = ["client@test.com", "user@test.com"];

interface AuthContextType {
  user: User | null;
  login: (email: string) => boolean; // Retourne true si succès, false si non trouvé
  register: (email: string, fullName: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isWorker: boolean;
  registeredEmails: string[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [registeredEmails, setRegisteredEmails] = useState<string[]>([]);

  // Initialisation : Charger la base de données depuis le localStorage ou utiliser les défauts
  useEffect(() => {
    const storedUser = localStorage.getItem('locaauto_user');
    if (storedUser) setUser(JSON.parse(storedUser));

    const storedEmails = localStorage.getItem('locaauto_db_emails');
    if (storedEmails) {
      setRegisteredEmails(JSON.parse(storedEmails));
    } else {
      const allDefaults = [...ADMIN_EMAILS, ...WORKER_EMAILS, ...INITIAL_CLIENTS];
      setRegisteredEmails(allDefaults);
      localStorage.setItem('locaauto_db_emails', JSON.stringify(allDefaults));
    }
  }, []);

  const login = (email: string): boolean => {
    const lowerEmail = email.toLowerCase().trim();
    
    // Vérification de l'existence dans la base de données simulée
    if (!registeredEmails.includes(lowerEmail)) {
      return false; 
    }

    let role: 'CLIENT' | 'WORKER' | 'ADMIN' = 'CLIENT';
    let fullName = "Utilisateur";

    if (ADMIN_EMAILS.includes(lowerEmail)) {
        role = 'ADMIN';
        fullName = "Administrateur Système";
    } else if (WORKER_EMAILS.includes(lowerEmail)) {
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
    return true;
  };

  const register = (email: string, fullName: string) => {
    const lowerEmail = email.toLowerCase().trim();
    if (!registeredEmails.includes(lowerEmail)) {
      const newList = [...registeredEmails, lowerEmail];
      setRegisteredEmails(newList);
      localStorage.setItem('locaauto_db_emails', JSON.stringify(newList));
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
      isWorker,
      registeredEmails 
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
