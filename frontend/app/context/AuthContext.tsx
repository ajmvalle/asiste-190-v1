import React, { createContext, useContext, useEffect, useState } from "react";
import { apiFetch } from "../lib/api";

const API_URL = "http://localhost:8000/api/auth";

export type User = {
  id: number;
  username: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* =====================================================
   🔐 Helper para leer cookies (CSRF)
===================================================== */
function getCookie(name: string): string | null {
  let cookieValue: string | null = null;

  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const c = cookie.trim();
      if (c.startsWith(name + "=")) {
        cookieValue = decodeURIComponent(c.substring(name.length + 1));
        break;
      }
    }
  }

  return cookieValue;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /* =====================================================
     🔄 Al iniciar:
        1) Pedir CSRF
        2) Ver si hay sesión
  ===================================================== */
  useEffect(() => {
    async function initAuth() {
      await apiFetch("/api/auth/csrf/", { method: "GET" });
      await refreshUser();
    }

    initAuth();
  }, []);

  async function refreshUser() {
    try {
      const res = await fetch(`${API_URL}/me/`, {
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function login(username: string, password: string) {
    const res = await apiFetch("/api/auth/login/", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) return false;

    await refreshUser();
    return true;
  }

  async function logout() {
    await apiFetch("/api/auth/logout/", {
      method: "POST",
    });

    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }

  return context;
}
