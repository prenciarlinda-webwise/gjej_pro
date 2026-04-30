"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { api, tokenStore, type User } from "@/lib/api";

interface AuthState {
  user: User | null;
  loading: boolean;
  signIn: (user: User, access: string, refresh: string) => void;
  signOut: () => void;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!tokenStore.getAccess()) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const me = await api.me();
      setUser(me);
    } catch {
      tokenStore.clear();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const signIn = (u: User, access: string, refreshToken: string) => {
    tokenStore.set(access, refreshToken);
    setUser(u);
  };

  const signOut = () => {
    tokenStore.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
