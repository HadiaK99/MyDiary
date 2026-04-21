"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { User, UserRole } from "@shared/types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password?: string) => void;
  signup: (username: string, role: UserRole, password?: string, childId?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.user) setUser(data.user);
      } catch (err) {
        console.error("Session check failed", err);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  const redirectAfterAuth = (role: UserRole) => {
    switch (role) {
      case "ADMIN": router.push("/admin"); break;
      case "PARENT": router.push("/parent"); break;
      case "CHILD": router.push("/"); break;
    }
  };

  const login = async (username: string, password?: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.user) { setUser(data.user); redirectAfterAuth(data.user.role); }
      else alert(data.error || "Login failed");
    } catch { alert("Something went wrong during login"); }
    finally { setLoading(false); }
  };

  const signup = async (username: string, role: UserRole, password?: string, childId?: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, role, childId }),
      });
      const data = await res.json();
      if (data.user) { setUser(data.user); redirectAfterAuth(data.user.role); }
      else alert(data.error || "Signup failed");
    } catch { alert("Something went wrong during signup"); }
    finally { setLoading(false); }
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
