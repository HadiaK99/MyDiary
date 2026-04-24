"use client";

import { useAuth } from "@frontend/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
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
import { AdminContainer } from "./AdminStyles";
import { Button } from "@frontend/components/Common/Button";

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


  if (loading || !user) return <div className="loading-screen">Loading...</div>;

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/users", label: "Manage Users", icon: Users },
    { href: "/admin/tasks", label: "Daily Tasks", icon: Settings },
    { href: "/admin/records", label: "User Records", icon: BookOpen },
    { href: "/admin/rankings", label: "Rankings", icon: Trophy },
  ];

  return (
    <AdminContainer>
      {/* Mobile Top Header */}
      <header className="mobile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="admin-avatar" style={{ width: '35px', height: '35px', fontSize: '1rem', borderRadius: '10px' }}>A</div>
          <span style={{ fontWeight: 800, color: '#1e293b' }}>Admin Panel</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Button 
            variant="ghost" 
            onClick={logout}
            style={{ padding: '8px 12px', fontSize: '0.75rem' }}
            title="Logout"
          >
            <LogOut size={16} />
          </Button>
          <button 
            className="menu-btn" 
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open Menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Sidebar Drawer Overlay */}
      <div 
        className={`overlay ${isSidebarOpen ? 'overlay-active' : ''}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      <aside className={isSidebarOpen ? 'sidebar-open' : ''}>
        <div className="sidebar-header">
          <div className="admin-avatar">A</div>
          <div>
            <h3>Admin Panel</h3>
            <p>{user.username}</p>
          </div>
          <button 
            className="menu-btn" 
            style={{ marginLeft: 'auto', display: isSidebarOpen ? 'flex' : 'none' }}
            onClick={() => setIsSidebarOpen(false)}
          >
            <CloseIcon size={20} />
          </button>
        </div>

        <nav>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`nav-item ${isActive ? 'active' : ""}`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <Icon size={20} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <Button onClick={logout} variant="secondary" fullWidth>
            <LogOut size={18} style={{ marginRight: '8px' }} /> Logout
          </Button>
        </div>
      </aside>

      <main>
        {children}
      </main>
    </AdminContainer>
  );
}
