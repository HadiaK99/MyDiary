"use client";

import { useAuth } from "@frontend/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { 
  Heart, 
  BarChart3, 
  MessageSquare, 
  LogOut,
  Home
} from "lucide-react";
import { ParentContainer } from "./ParentStyles";
import { Button } from "@frontend/components/Common/Button";

export default function ParentLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== "PARENT")) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) return <div className="loading-screen">Loading...</div>;

  return (
    <ParentContainer>
      <nav className="navbar">
        <div className="nav-logo">
          <Heart size={24} fill="var(--primary)" color="var(--primary)" />
          <span>Parent Hub</span>
        </div>
        <div className="nav-links">
          <Link href="/parent"><Home size={20} /> Home</Link>
          <Link href="/parent/report"><BarChart3 size={20} /> Reports</Link>
          <Link href="/parent/reviews"><MessageSquare size={20} /> My Reviews</Link>
        </div>
        <div className="user-info">
          <span>Hi, {user.username}</span>
          <Button variant="secondary" onClick={logout} style={{ padding: '8px 15px', fontSize: '0.8rem' }}>
            <LogOut size={16} />
          </Button>
        </div>
      </nav>

      <main>
        {children}
      </main>
    </ParentContainer>
  );
}
