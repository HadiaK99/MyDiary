"use client";

import { useAuth } from "@frontend/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Heart, 
  BarChart3, 
  MessageSquare, 
  LogOut, 
  Home,
  Settings2,
  Menu,
  X as CloseIcon,
  LayoutDashboard,
  ChevronDown
} from "lucide-react";
import { ParentContainer } from "./ParentStyles";
import { Button } from "@frontend/components/Common/Button";
import { ChildProvider, useChild } from "@frontend/context/ChildContext";

export default function ParentLayout({ children }: { children: React.ReactNode }) {
  return (
    <ChildProvider>
      <ParentLayoutInner>{children}</ParentLayoutInner>
    </ChildProvider>
  );
}

function ParentLayoutInner({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading, logout } = useAuth();
  const { children: childList, selectedChild, setSelectedChildId, loading: childLoading } = useChild();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "PARENT")) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) return <div className="loading-screen">Loading...</div>;

  const navItems = [
    { href: "/parent", label: "Parent Dashboard", icon: LayoutDashboard },
    { href: "/parent/activities", label: "Activities", icon: Settings2 },
    { href: "/parent/report", label: "Reports", icon: BarChart3 },
    { href: "/parent/reviews", label: "My Reviews", icon: MessageSquare },
  ];

  return (
    <ParentContainer>
      {/* Mobile Top Header */}
      <header className="mobile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="parent-avatar" style={{ width: '35px', height: '35px', fontSize: '1rem', borderRadius: '10px' }}>P</div>
          <span style={{ fontWeight: 800, color: '#be123c' }}>Parent Hub</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Button 
            variant="ghost" 
            onClick={logout}
            style={{ padding: '8px 12px', fontSize: '0.75rem', color: '#be123c' }}
          >
            <LogOut size={16} />
          </Button>
          <button 
            className="menu-btn" 
            onClick={() => setIsSidebarOpen(true)}
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
          <div className="parent-avatar">{user.username.charAt(0)}</div>
          <div>
            <h3>Parent Hub</h3>
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

        {/* Child Selector */}
        <div style={{ padding: '0 10px 25px', marginBottom: '15px', borderBottom: '1px solid #ffe4e6' }}>
          <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#9f1239', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
            Viewing Data For:
          </label>
          <div style={{ position: 'relative' }}>
            <select 
              value={selectedChild?.id || ""}
              onChange={(e) => setSelectedChildId(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '10px 12px', 
                borderRadius: '12px', 
                border: '2px solid #fbcfe8',
                background: '#fff1f2',
                color: '#be123c',
                fontWeight: 700,
                fontSize: '0.9rem',
                appearance: 'none',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              {childList.map(c => (
                <option key={c.id} value={c.id}>{c.username}</option>
              ))}
              {childList.length === 0 && <option value="">No children linked</option>}
            </select>
            <ChevronDown size={16} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#be123c' }} />
          </div>
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
          
          <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
            <button 
              onClick={logout}
              className="nav-item"
              style={{ color: '#be123c', marginTop: '10px' }}
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </nav>
      </aside>

      <main>
        {children}
      </main>
    </ParentContainer>
  );
}
