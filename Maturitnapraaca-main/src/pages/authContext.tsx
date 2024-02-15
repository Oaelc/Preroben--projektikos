// authContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { redirect } from 'react-router-dom'; // Import useNavigate

interface AuthContextProps {
  user: any;
  login: (user: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);


  const login = (user: any) => {
    setUser(user);
  };

  const logout = () => {
    setUser(null);
    redirect('/login'); // Redirect to the login page after logout
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
