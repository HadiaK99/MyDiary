"use client";

import Link from "next/link";
import styles from "./Header.module.css";
import { usePathname } from "next/navigation";
import { Settings, Star } from "lucide-react";

export default function Header() {
  const pathname = usePathname();
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
        <Link href="/onboarding" className={styles.settingsBtn}>
          <Settings size={20} />
        </Link>
      </div>
    </header>
  );
}
