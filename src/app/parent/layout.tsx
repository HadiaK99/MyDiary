"use client";

import { useAuth } from "@frontend/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import styles from "./parent.module.css";
import Link from "next/link";
import { 
  Heart, 
  BarChart3, 
  MessageSquare, 
  Settings,
  LogOut,
  Home
} from "lucide-react";

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
    <div className={styles.parentContainer}>
      <nav className={styles.navbar}>
        <div className={styles.navLogo}>
          <Heart size={24} fill="var(--primary)" color="var(--primary)" />
          <span>Parent Hub</span>
        </div>
        <div className={styles.navLinks}>
          <Link href="/parent"><Home size={20} /> Home</Link>
          <Link href="/parent/reports"><BarChart3 size={20} /> Reports</Link>
          <Link href="/parent/reviews"><MessageSquare size={20} /> My Reviews</Link>
        </div>
        <div className={styles.userInfo}>
          <span>Hi, {user.username}</span>
          <button onClick={logout} className="pill-btn" style={{ padding: '8px 15px', fontSize: '0.8rem' }}>
            <LogOut size={16} />
          </button>
        </div>
      </nav>

      <main className={styles.content}>
        {children}
      </main>
    </div>
  );
}
