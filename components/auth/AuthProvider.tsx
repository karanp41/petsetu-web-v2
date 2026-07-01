"use client";
import type { AuthResponse, AuthUser, TokenPair } from "@/lib/auth";
import {
  AUTH_LOGOUT_EVENT,
  AUTH_STORAGE_KEY,
  clearAuthSession,
  installAuth401Interceptor,
} from "@/lib/http";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthState {
  user: AuthUser | null;
  tokens: TokenPair | null;
  loading: boolean;
  register: (data: RegisterInput) => Promise<AuthResponse>;
  login: (email: string, password: string) => Promise<AuthResponse>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
  city?: string;
  country?: string;
  pincode?: number;
  coordinates?: [number, number];
  role?: string;
  userType?: string[];
  sellerType?: string;
}

interface PersistedPayload {
  user: AuthUser;
  tokens: TokenPair;
}

// IMPORTANT: For client components only variables prefixed with NEXT_PUBLIC_ are exposed.
// Ensure you have NEXT_PUBLIC_API_BASE in your .env.local (e.g. NEXT_PUBLIC_API_BASE=http://localhost:4000/v1)
const API_BASE = process.env.NEXT_PUBLIC_API_BASE; // client-visible only

async function clientPost<T>(path: string, body: any): Promise<T> {
  if (!API_BASE) {
    throw new Error("API base not configured.");
  }
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    let errDetails: any = undefined;
    try {
      errDetails = await res.json();
    } catch {
      errDetails = await res.text();
    }
    throw new Error(errDetails?.message || errDetails || "Request failed");
  }
  return res.json();
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [tokens, setTokens] = useState<TokenPair | null>(null);
  const [loading, setLoading] = useState(true);

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const raw =
        typeof window !== "undefined"
          ? localStorage.getItem(AUTH_STORAGE_KEY)
          : null;
      if (raw) {
        const parsed: PersistedPayload = JSON.parse(raw);
        setUser(parsed.user);
        setTokens(parsed.tokens);
      }
    } catch (e) {
      /* ignore */
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleLogout = () => {
      setUser(null);
      setTokens(null);
    };

    window.addEventListener(AUTH_LOGOUT_EVENT, handleLogout);
    return () => window.removeEventListener(AUTH_LOGOUT_EVENT, handleLogout);
  }, []);

  useEffect(() => {
    return installAuth401Interceptor();
  }, []);

  const persist = useCallback((payload: PersistedPayload) => {
    setUser(payload.user);
    setTokens(payload.tokens);
    if (typeof window !== "undefined") {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload));
    }
  }, []);

  async function syncHttpOnlyCookie(tokens: TokenPair) {
    // Fire-and-forget; we don't block UI on this.
    try {
      await fetch("/api/auth/session", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          accessToken: tokens.access.token,
          expires: tokens.access.expires,
        }),
      });
    } catch {
      // ignore silently; SSR fallback will miss token until next successful call
    }
  }

  const register = useCallback(
    async (data: RegisterInput): Promise<AuthResponse> => {
      const loc = data.coordinates
        ? { type: "Point", coordinates: data.coordinates }
        : undefined;
      const payload = {
        email: data.email,
        password: data.password,
        name: data.name,
        phone: data.phone,
        city: data.city,
        country: data.country,
        pincode: data.pincode,
        role: data.role || "user",
        userType: data.userType || ["seller"],
        sellerType: data.sellerType || "individual",
        loc,
      };
      const resp = await clientPost<AuthResponse>("/auth/register", payload);
      persist(resp);
      // Sync cookie for server components.
      await syncHttpOnlyCookie(resp.tokens);
      return resp;
    },
    [persist]
  );

  const login = useCallback(
    async (email: string, password: string): Promise<AuthResponse> => {
      const resp = await clientPost<AuthResponse>("/auth/login", {
        email,
        password,
      });
      persist(resp);
      await syncHttpOnlyCookie(resp.tokens);
      return resp;
    },
    [persist]
  );

  const logout = useCallback(() => {
    setUser(null);
    setTokens(null);
    clearAuthSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, tokens, loading, register, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
