import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Organization } from '@/types';
import { currentUser, loginUser, organizations } from '@/data/mockData';

interface AuthContextType {
  user: User | null;
  organization: Organization | null;
  isLoading: boolean;
  login: (email: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
  isTeacher: boolean;
  isStudent: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simular carregamento inicial
  useEffect(() => {
    setTimeout(() => {
      setUser(currentUser); // Usuário logado por padrão
      setIsLoading(false);
    }, 1000);
  }, []);

  const login = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simular chamada de API
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const foundUser = loginUser(email);
    if (foundUser) {
      setUser(foundUser);
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  // Buscar organização do usuário
  const organization = user ? organizations.find(org => org.id === user.organizationId) || null : null;

  const value: AuthContextType = {
    user,
    organization,
    isLoading,
    login,
    logout,
    isAdmin: user?.role === 'admin',
    isTeacher: user?.role === 'teacher',
    isStudent: user?.role === 'student',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};