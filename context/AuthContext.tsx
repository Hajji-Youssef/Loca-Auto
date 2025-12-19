
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../types';

interface UserCredential {
  email: string;
  password: string;
  fullName: string;
}

const DEFAULT_STAFF_PASSWORD = "admin";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => { success: boolean, error?: string };
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
      const defaultCreds = [
          { email: "admin@locaauto.com", password: DEFAULT_STAFF_PASSWORD, fullName: "Direction Générale" },
          { email: "sophie.worker@locaauto.com", password: DEFAULT_STAFF_PASSWORD, fullName: "Sophie Martin" },
          { email: "lucas.worker@locaauto.com", password: DEFAULT_STAFF_PASSWORD, fullName: "Lucas Dubois" }
      ];
      setCredentials(defaultCreds);
      localStorage.setItem('locaauto_db_creds', JSON.stringify(defaultCreds));
    }
  }, []);

  const login = (email: string, password: string): { success: boolean, error?: string } => {
    const lowerEmail = email.toLowerCase().trim();
    
    // Détection auto-rôle par mot-clé (conformément à la demande utilisateur)
    const isAdmin = lowerEmail.includes('admin');
    const isWorker = lowerEmail.includes('worker');

    // Vérification en base (on vérifie d'abord si le compte existe dans les credentials stockés)
    const account = credentials.find(c => c.email === lowerEmail);
    
    if (!account && !isAdmin && !isWorker) {
        return { 
            success: false, 
            error: "Accès refusé : Ce compte n'existe pas. Veuillez vous inscrire." 
        };
    }

    // Si c'est un staff (admin ou email contenant 'worker'), le mot de passe par défaut est 'admin'
    // Sauf s'il a été créé manuellement via SignUp avec un autre password
    const expectedPassword = account ? account.password : DEFAULT_STAFF_PASSWORD;

    if (password !== expectedPassword) {
        return { success: false, error: "Mot de passe incorrect." };
    }

    const role = isAdmin ? 'ADMIN' : (isWorker ? 'WORKER' : 'CLIENT');
    const fullName = account ? account.fullName : (isAdmin ? "Administrateur" : "Agent de Flotte");

    const sessionUser: User = {
      id: Math.floor(Math.random() * 9000),
      fullName: fullName,
      email: lowerEmail,
      role: role,
      isOnline: true,
      token: "session-" + Math.random().toString(36).substring(7)
    };

    setUser(sessionUser);
    localStorage.setItem('locaauto_user', JSON.stringify(sessionUser));
    return { success: true };
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

  const isStaff = user?.role === 'WORKER' || user?.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      isAuthenticated: !!user, 
      isWorker: isStaff 
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
