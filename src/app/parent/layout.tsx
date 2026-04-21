"use client";

import { useAuth } from "@frontend/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import styles from "./parent.module.css";
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
          <button onClick={() => router.push("/parent")} type="button"><Home size={20} /> Home</button>
          <button onClick={() => router.push("/parent/reports")} type="button"><BarChart3 size={20} /> Reports</button>
          <button onClick={() => router.push("/parent/reviews")} type="button"><MessageSquare size={20} /> My Reviews</button>
        </div>
        <div className={styles.userInfo}>
          <span>Hi, {user.username}</span>
          <button onClick={logout} className="pill-btn" style={{ padding: '8px 15px', fontSize: '0.8rem' }} type="button">
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
