import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const mockUser = {
    id: 1,
    name: 'Demo User',
    email: 'demo@sportsplex.com'
  };

  const toggleMockAuth = () => {
    if (isLoggedIn) {
      // Logout
      setIsLoggedIn(false);
      setUser(null);
    } else {
      // Login with mock user
      setIsLoggedIn(true);
      setUser(mockUser);
    }
  };

  const login = (email, password) => {
    // Mock login - replace with real API call later
    setIsLoggedIn(true);
    setUser(mockUser);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, 
      user, 
      toggleMockAuth, 
      login, 
      logout 
    }}>
      {children}
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
