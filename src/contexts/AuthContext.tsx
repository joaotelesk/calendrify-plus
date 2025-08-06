import { Organization, User } from "@/types";
import { jwtDecode } from "jwt-decode";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: User | null;
  organization: Organization | null;
  isLoading: boolean;
  login: (googleToken: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
  isTeacher: boolean;
  isStudent: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth precisa estar dentro de AuthProvider");
  return context;
};

// Mock data para simulação
const mockUsers = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin" as const,
    organizationId: "org1",
    picture: "https://via.placeholder.com/40"
  },
  {
    id: "2", 
    name: "Professor Silva",
    email: "professor@example.com",
    role: "teacher" as const,
    organizationId: "org1",
    picture: "https://via.placeholder.com/40"
  },
  {
    id: "3",
    name: "João Student", 
    email: "student@example.com",
    role: "student" as const,
    organizationId: "org1",
    picture: "https://via.placeholder.com/40"
  }
];

const mockOrganization: Organization = {
  id: "org1",
  name: "Universidade Exemplo",
  slug: "universidade-exemplo",
  description: "Uma universidade de exemplo para demonstração",
  type: "Universidade",
  address: "Rua Exemplo, 123 - São Paulo, SP"
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (token) {
          // Simulate getting user from token
          const userData = localStorage.getItem("user_data");
          if (userData) {
            setUser(JSON.parse(userData));
            setOrganization(mockOrganization);
          }
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error);
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_data");
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (googleToken: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Decode Google token to get email
      const decoded: any = jwtDecode(googleToken);
      const userEmail = decoded.email;
      
      // Find user by email in mock data
      const foundUser = mockUsers.find(u => u.email === userEmail);
      
      if (foundUser) {
        // Simulate successful login
        localStorage.setItem("auth_token", googleToken);
        localStorage.setItem("user_data", JSON.stringify(foundUser));
        setUser(foundUser);
        setOrganization(mockOrganization);
        return true;
      } else {
        // Create new user for demo
        const newUser = {
          id: Date.now().toString(),
          name: decoded.name || "New User",
          email: userEmail,
          role: "student" as const,
          organizationId: "org1",
          picture: decoded.picture || "https://via.placeholder.com/40"
        };
        
        localStorage.setItem("auth_token", googleToken);
        localStorage.setItem("user_data", JSON.stringify(newUser));
        setUser(newUser);
        setOrganization(mockOrganization);
        return true;
      }
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");
    setUser(null);
    setOrganization(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        organization,
        isLoading,
        login,
        logout,
        isAdmin: user?.role === "admin",
        isTeacher: user?.role === "teacher",
        isStudent: user?.role === "student",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
