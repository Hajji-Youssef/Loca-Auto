
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../types';

interface UserCredential {
  email: string;
  password: string;
  fullName: string;
}

// RÉGLAGES PAR DÉFAUT (Mot de passe par défaut : 123456)
const DEFAULT_PASSWORD = "123456";
const ADMIN_CREDENTIALS: UserCredential[] = [
  { email: "admin@locaauto.com", password: DEFAULT_PASSWORD, fullName: "Administrateur Système" },
  { email: "admin@gmail.com", password: DEFAULT_PASSWORD, fullName: "Administrateur Système" }
];
const WORKER_CREDENTIALS: UserCredential[] = [
  { email: "worker@locaauto.com", password: DEFAULT_PASSWORD, fullName: "Agent de Flotte" },
  { email: "agent@locaauto.com", password: DEFAULT_PASSWORD, fullName: "Agent de Flotte" }
];
const INITIAL_CLIENTS: UserCredential[] = [
  { email: "client@test.com", password: DEFAULT_PASSWORD, fullName: "Jean Dupont" }
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
      const allDefaults = [...ADMIN_CREDENTIALS, ...WORKER_CREDENTIALS, ...INITIAL_CLIENTS];
      setCredentials(allDefaults);
      localStorage.setItem('locaauto_db_creds', JSON.stringify(allDefaults));
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    const lowerEmail = email.toLowerCase().trim();
    
    // Recherche de l'utilisateur dans la base simulée avec vérification du mot de passe
    const found = credentials.find(c => c.email === lowerEmail && c.password === password);
    
    if (!found) return false;

    let role: 'CLIENT' | 'WORKER' | 'ADMIN' = 'CLIENT';
    if (ADMIN_CREDENTIALS.some(c => c.email === lowerEmail)) role = 'ADMIN';
    else if (WORKER_CREDENTIALS.some(c => c.email === lowerEmail)) role = 'WORKER';
    
    const mockUser: User = {
      id: Math.floor(Math.random() * 1000),
      fullName: found.fullName,
      email: lowerEmail,
      role: role,
      isOnline: true,
      token: "secure-session-" + Math.random().toString(36).substr(2)
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
