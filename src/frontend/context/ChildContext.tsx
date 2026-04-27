"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

interface Child {
  id: string;
  username: string;
}

interface ChildContextType {
  children: Child[];
  selectedChild: Child | null;
  setSelectedChildId: (id: string) => void;
  loading: boolean;
}

const ChildContext = createContext<ChildContextType | undefined>(undefined);

export function ChildProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [childList, setChildList] = useState<Child[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === "PARENT") {
      const fetchChildren = async () => {
        try {
          const res = await fetch("/api/auth/me");
          if (!res.ok) {
            console.error("Failed to fetch session:", await res.text());
            return;
          }
          const data = await res.json();
          if (data.user?.children) {
            setChildList(data.user.children);
            if (data.user.children.length > 0 && !selectedChildId) {
              setSelectedChildId(data.user.children[0].id);
            }
          }
        } catch (error) {
          console.error("Failed to fetch children:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchChildren();
    } else {
      setLoading(false);
    }
  }, [user]);

  const selectedChild = childList.find(c => c.id === selectedChildId) || null;

  return (
    <ChildContext.Provider 
      value={{ 
        children: childList, 
        selectedChild, 
        setSelectedChildId, 
        loading 
      }}
    >
      {children}
    </ChildContext.Provider>
  );
}

export function useChild() {
  const context = useContext(ChildContext);
  if (context === undefined) {
    throw new Error("useChild must be used within a ChildProvider");
  }
  return context;
}
