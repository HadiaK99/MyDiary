"use client";

import { useAuth } from "@frontend/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./admin.module.css";
import { 
  Users, 
  Settings, 
  Trophy, 
  LayoutDashboard,
  LogOut,
  BookOpen,
  Menu,
  X as CloseIcon
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user.role !== "ADMIN")) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Close sidebar on navigation
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  if (loading || !user) return <div className="loading-screen">Loading...</div>;

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/users", label: "Manage Users", icon: Users },
    { href: "/admin/tasks", label: "Daily Tasks", icon: Settings },
    { href: "/admin/records", label: "User Records", icon: BookOpen },
    { href: "/admin/rankings", label: "Rankings", icon: Trophy },
  ];

  return (
    <div className={styles.adminContainer}>
      {/* Mobile Top Header */}
      <header className={styles.mobileHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className={styles.adminAvatar} style={{ width: '35px', height: '35px', fontSize: '1rem', borderRadius: '10px' }}>A</div>
          <span style={{ fontWeight: 800, color: '#1e293b' }}>Admin Panel</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button 
            className="pill-btn" 
            onClick={logout}
            style={{ padding: '8px 12px', fontSize: '0.75rem' }}
            title="Logout"
          >
            <LogOut size={16} />
          </button>
          <button 
            className={styles.menuBtn} 
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open Menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Sidebar Drawer Overlay */}
      <div 
        className={`${styles.overlay} ${isSidebarOpen ? styles.overlayActive : ''}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.adminAvatar}>A</div>
          <div>
            <h3>Admin Panel</h3>
            <p>{user.username}</p>
          </div>
          <button 
            className={styles.menuBtn} 
            style={{ marginLeft: 'auto', display: isSidebarOpen ? 'flex' : 'none' }}
            onClick={() => setIsSidebarOpen(false)}
          >
            <CloseIcon size={20} />
          </button>
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

        <div className={styles.sidebarFooter}>
          <button onClick={logout} className="pill-btn" style={{ width: '100%', justifyContent: 'center' }} type="button">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      <main className={styles.content}>
        {children}
      </main>
    </div>
  );
}
