"use client";

import { useAuth } from "@frontend/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import styles from "./admin.module.css";
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
          <button onClick={() => router.push("/admin")} type="button"><LayoutDashboard size={20} /> Dashboard</button>
          <button onClick={() => router.push("/admin/users")} type="button"><Users size={20} /> Manage Users</button>
          <button onClick={() => router.push("/admin/tasks")} type="button"><Settings size={20} /> Daily Tasks</button>
          <button onClick={() => router.push("/admin/rankings")} type="button"><Trophy size={20} /> Rankings</button>
        </nav>

        <button onClick={logout} className={styles.logoutBtn} type="button">
          <LogOut size={20} /> Logout
        </button>
      </aside>

      <main className={styles.content}>
        {children}
      </main>
    </div>
  );
}
