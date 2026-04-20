"use client";

import Link from "next/link";
import styles from "./Header.module.css";
import { usePathname } from "next/navigation";
import { useAuth } from "@frontend/context/AuthContext";
import { LogOut, Star, User } from "lucide-react";

export default function Header() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const isHome = pathname === "/";

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        {!isHome && (
          <Link href="/" className="back-btn-styled" title="Return to Dashboard">
            <i className="back-arrow"></i>
          </Link>
        )}
      </div>

      <div className={styles.center}>
        <div className="glass" style={{ padding: '8px 24px', borderRadius: '40px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Star size={18} className={styles.brandIcon} />
          <span className={styles.brand}>MyDiary</span>
        </div>
      </div>

      <div className={styles.right}>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <User size={14} /> {user.username}
            </span>
            <button onClick={logout} className={styles.settingsBtn} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444' }} title="Logout">
              <LogOut size={20} />
            </button>
          </div>
        ) : (
          <Link href="/login" className={styles.settingsBtn}>
            <User size={20} />
          </Link>
        )}
      </div>
    </header>
  );
}
