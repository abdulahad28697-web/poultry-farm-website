import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import {
  fetchCurrentUser,
  loginAdmin as loginAdminRequest,
  loginUser as loginUserRequest,
  registerUser as registerUserRequest
} from '../services/api.js';

const AUTH_TOKEN_KEY = 'hf_auth_token';

const AuthContext = createContext(null);

function readStoredToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY) || '';
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(readStoredToken);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(Boolean(readStoredToken()));

  useEffect(() => {
    let isMounted = true;

    async function loadCurrentUser() {
      if (!token) {
        if (isMounted) {
          setUser(null);
          setIsLoading(false);
        }
        return;
      }

      try {
        const data = await fetchCurrentUser(token);
        if (isMounted) {
          setUser(data.user);
        }
      } catch {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        if (isMounted) {
          setToken('');
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadCurrentUser();

    return () => {
      isMounted = false;
    };
  }, [token]);

  function applyAuth(data) {
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem(AUTH_TOKEN_KEY, data.token);
  }

  async function loginUser(credentials) {
    const data = await loginUserRequest(credentials);
    applyAuth(data);
    return data;
  }

  async function loginAdmin(credentials) {
    const data = await loginAdminRequest(credentials);
    applyAuth(data);
    return data;
  }

  async function register(credentials) {
    const data = await registerUserRequest(credentials);
    applyAuth(data);
    return data;
  }

  function logout() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setToken('');
    setUser(null);
  }

  const value = useMemo(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: Boolean(token && user),
      isAdmin: user?.role === 'admin',
      isUser: user?.role === 'user',
      loginUser,
      loginAdmin,
      register,
      logout
    }),
    [token, user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider.');
  }
  return context;
}
