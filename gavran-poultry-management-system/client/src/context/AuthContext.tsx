import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: number;
  name: string;
  phone: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (phone: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, phone: string, password: string, role?: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      // Validate token (basic check)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp * 1000 < Date.now()) {
          logout();
        } else {
          // Fetch user details
          fetchUserDetails();
        }
      } catch (e) {
        logout();
      }
    } else {
      setUser(null);
    }
  }, [token]);

  const fetchUserDetails = async () => {
    if (!token) return;

    try {
      const response = await fetch('http://localhost:5000/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);
      } else {
        logout();
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      logout();
    }
  };

  const login = async (phone: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setToken(data.token);
        localStorage.setItem('token', data.token);
        setUser(data.user);
        navigate('/dashboard');
        return true;
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    navigate('/login');
  };

  const register = async (name: string, phone: string, password: string, role?: string): Promise<boolean> => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name, phone, password, role }),
      });

      const data = await response.json();

      if (response.ok) {
        return true;
      } else {
        throw new Error(data.message || 'Registration failed');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed');
    }
  };

  const value = {
    user,
    token,
    login,
    logout,
    register
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};