// import { currentUser, loginUser, organizations } from "@/data/mockData";
// import { Organization, User } from "@/types";
// import React, { createContext, useContext, useEffect, useState } from "react";

// interface AuthContextType {
//   user: User | null;
//   organization: Organization | null;
//   isLoading: boolean;
//   login: (email: string) => Promise<boolean>;
//   logout: () => void;
//   isAdmin: boolean;
//   isTeacher: boolean;
//   isStudent: boolean;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   // Simular carregamento inicial
//   useEffect(() => {
//     setTimeout(() => {
//       setUser(currentUser); // Usuário logado por padrão
//       setIsLoading(false);
//     }, 1000);
//   }, []);

//   const login = async (email: string): Promise<boolean> => {
//     setIsLoading(true);

//     // Simular chamada de API
//     await new Promise((resolve) => setTimeout(resolve, 1500));

//     const foundUser = loginUser(email);
//     if (foundUser) {
//       setUser(foundUser);
//       setIsLoading(false);
//       return true;
//     }

//     setIsLoading(false);
//     return false;
//   };

//   const logout = () => {
//     setUser(null);
//   };

//   // Buscar organização do usuário
//   const organization = user
//     ? organizations.find((org) => org.id === user.organizationId) || null
//     : null;

//   const value: AuthContextType = {
//     user,
//     organization,
//     isLoading,
//     login,
//     logout,
//     isAdmin: user?.role === "admin",
//     isTeacher: user?.role === "teacher",
//     isStudent: user?.role === "student",
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// src/contexts/AuthContext.tsx
import { organizations } from "@/data/mockData";
import { Organization, User } from "@/types";
import { jwtDecode } from "jwt-decode";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: User | null;
  Organization: Organization | null;
  isLoading: boolean;
  login: (googleToken: string) => void;
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("google_token");
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setUser({
          id: decoded.sub,
          name: decoded.name,
          email: decoded.email,
          picture: decoded.picture,
          role: "admin", // fixo ou ajustável no futuro
          organizationId: "1", // fixo ou dinâmico depois
        });
      } catch {
        localStorage.removeItem("google_token");
      }
    }
    setIsLoading(false);
  }, []);

  const login = (googleToken: string): boolean => {
    try {
      const decoded: any = jwtDecode(googleToken);
      const newUser: User = {
        id: decoded.sub,
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture,
        role: "admin",
        organizationId: "org-1",
      };
      localStorage.setItem("google_token", googleToken);
      setUser(newUser);
      return true;
    } catch (err) {
      console.error("Erro ao decodificar token do Google", err);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("google_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        organizations,
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
