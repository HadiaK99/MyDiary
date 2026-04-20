"use client";

import { useAuth } from "@frontend/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import styles from "./admin.module.css";
import Link from "next/link";
import { 
  Users, 
  Settings, 
  Trophy, 
  LayoutDashboard,
  LogOut,
  ChevronRight
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== "ADMIN")) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) return <div className="loading-screen">Loading...</div>;

  return (
    <div className={styles.adminContainer}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.adminAvatar}>A</div>
          <div>
            <h3>Admin Panel</h3>
            <p>{user.username}</p>
          </div>
        </div>

        <nav className={styles.nav}>
          <Link href="/admin"><LayoutDashboard size={20} /> Dashboard</Link>
          <Link href="/admin/users"><Users size={20} /> Manage Users</Link>
          <Link href="/admin/tasks"><Settings size={20} /> Daily Tasks</Link>
          <Link href="/admin/rankings"><Trophy size={20} /> Rankings</Link>
        </nav>

        <button onClick={logout} className={styles.logoutBtn}>
          <LogOut size={20} /> Logout
        </button>
      </aside>

      <main className={styles.content}>
        {children}
      </main>
    </div>
  );
}
