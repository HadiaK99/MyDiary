"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn, signOut, useSession, SessionProvider } from "next-auth/react";
import type { User, UserRole } from "@shared/types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password?: string) => void;
  loginWithGoogle: () => void;
  signup: (username: string, role: UserRole, password?: string, childIds?: string[], email?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthProviderInternal({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const router = useRouter();

  useEffect(() => {
    if (session?.user) {
      // OAuth user not onboarded yet
      if (session.user.onboarded === false) {
        router.push("/signup");
        return;
      }

      setUser({
        id: session.user.id,
        username: session.user.username || session.user.name || "",
        email: session.user.email || "",
        role: session.user.role!,
        children: session.user.children,
      });

    } else if (status === "unauthenticated") {
      setUser(null);
    }
  }, [session, status, router]);

  const login = async (username: string, password?: string) => {
    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (result?.error) {
      alert(result.error || "Login failed");
    } else {
      // Session will update automatically via useSession
    }
  };

  const loginWithGoogle = (email?: string) => {
    signIn("google", {
      callbackUrl: "/",
      ...(email ? { login_hint: email } : {})
    });
  };

  const signup = async (username: string, role: UserRole, password?: string, childIds?: string[], email?: string) => {
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, role, childIds, email }),
      });
      const data = await res.json();
      if (data.user) {
        if (password) {
          await login(username, password);
        } else {
          router.push("/");
          router.refresh();
        }
      } else {
        alert(data.error || "Signup failed");
      }

    } catch {
      alert("Something went wrong during signup");
    }
  };

  const logout = async () => {
    await signOut({ redirect: false });
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithGoogle, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProviderInternal>{children}</AuthProviderInternal>
    </SessionProvider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
