import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();
export const API_BASE_URL = 'http://localhost:5000/api';

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const validateSession = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/profiles/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          setIsLoggedIn(true);
        } else {
          // Token expired or invalid
          logout();
        }
      } catch (error) {
        console.error("Session validation failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    validateSession();
  }, [token]);

  const login = async (email, password, rememberMe = false) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, rememberMe })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      const newToken = data.token;
      setToken(newToken);
      setUser(data.user);
      setIsLoggedIn(true);
      localStorage.setItem('token', newToken);

      return { success: true, role: data.user.role };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('token');
  };

  const register = async (full_name, email, password, phone_number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name, email, password, phone_number })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      return { success: true, message: data.message };
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, message: error.message };
    }
  };

  return (
    <AuthContext.Provider value={{
      isLoggedIn,
      user,
      token,
      isLoading,
      login,
      logout,
      register
    }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
