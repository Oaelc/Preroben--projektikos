import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Correct import for useNavigate

interface AuthContextProps {
  user: any;
  login: (user: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate(); // Using useNavigate hook

  const login = (user: any) => {
    setUser(user);
  };

  const logout = async () => {
    // Assuming axios or another HTTP client is used for API calls
    try {
      await axios.post('http://localhost:5000/api/logout');
      localStorage.removeItem('authToken'); // Assuming you store authToken in localStorage
      setUser(null);
      navigate('/login'); // Correctly redirect to the login page after logout
    } catch (error) {
      console.error('Logout error:', error);
    }
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
