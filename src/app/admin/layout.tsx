"use client";

import { useAuth } from "@frontend/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import styles from "./admin.module.css";
import { 
  Users, 
  Settings, 
  Trophy, 
  LayoutDashboard,
  LogOut
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && (!user || user.role !== "ADMIN")) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) return <div className="loading-screen">Loading...</div>;

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/users", label: "Manage Users", icon: Users },
    { href: "/admin/tasks", label: "Daily Tasks", icon: Settings },
    { href: "/admin/rankings", label: "Rankings", icon: Trophy },
  ];

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
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`${styles.navItem} ${isActive ? styles.active : ""}`}
              >
                <Icon size={20} />
                {item.label}
              </Link>
            );
          })}
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
