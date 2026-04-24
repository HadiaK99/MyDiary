"use client";

import styles from "./Header.module.css";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@frontend/context/AuthContext";
import { LogOut, Star, User, Settings, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isHome = pathname === "/";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className={styles.header}>
      <div className={`${styles.left} no-print`}>
        {!isHome && (
          <button 
            onClick={() => router.push("/")} 
            className="back-btn-styled" 
            title="Return to Dashboard"
            type="button"
          >
            <i className="back-arrow"></i>
          </button>
        )}
      </div>

      <div className={styles.center}>
        <button 
          onClick={() => router.push("/")}
          className="glass no-print" 
          style={{ 
            padding: '8px 24px', 
            borderRadius: '40px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            border: 'none',
            cursor: 'pointer',
            transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          type="button"
        >
          <Star size={18} className={styles.brandIcon} />
          <span className={styles.brand}>MyDiary</span>
        </button>
      </div>

      <div className={`${styles.right} no-print`}>
        {user ? (
          <div className={styles.userMenu} ref={dropdownRef}>
            <button 
              className={styles.usernameBtn}
              onClick={() => setShowDropdown(!showDropdown)}
              type="button"
            >
              <User size={18} />
              <span>{user.username}</span>
              <ChevronDown size={14} style={{ transform: showDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>

            {showDropdown && (
              <div className={styles.dropdown}>
                <button 
                  onClick={() => { router.push("/profile"); setShowDropdown(false); }} 
                  className={styles.dropdownItem}
                >
                  <User size={16} /> View Profile
                </button>
                <button 
                  onClick={() => { router.push("/settings"); setShowDropdown(false); }} 
                  className={styles.dropdownItem}
                >
                  <Settings size={16} /> Settings
                </button>
                <div className={styles.dropdownDivider} />
                <button 
                  onClick={() => { logout(); setShowDropdown(false); }} 
                  className={`${styles.dropdownItem} ${styles.logoutBtn}`}
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button 
            onClick={() => router.push("/login")} 
            className={styles.settingsBtn}
            style={{ border: 'none', background: 'none', cursor: 'pointer' }}
            type="button"
          >
            <User size={20} />
          </button>
        )}
      </div>
    </header>
  );
}
