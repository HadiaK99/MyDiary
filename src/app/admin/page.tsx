"use client";

import { useState } from "react";
import { User } from "@shared/types";
import styles from "./admin.module.css";
import { Users, BookOpen, Star, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const [stats] = useState(() => {
    if (typeof window === 'undefined') return { users: 0, children: 0, parents: 0, entries: 0 };
    const usersRaw = localStorage.getItem("diary-users") || "[]";
    const users: User[] = JSON.parse(usersRaw);
    
    // Count entries across all users (simulated by localStorage keys)
    const entryCount = Object.keys(localStorage).filter(key => key.startsWith("diary-202")).length;

    return {
      users: users.length,
      children: users.filter(u => u.role === "CHILD").length,
      parents: users.filter(u => u.role === "PARENT").length,
      entries: entryCount
    };
  });

  return (
    <div>
      <section className={styles.adminHeader}>
        <h1>System Overview</h1>
        <p>Monitor diary usage and manage your community.</p>
      </section>

      <div className={styles.dashboardGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#3b82f6' }}><Users size={28} /></div>
          <div className={styles.statInfo}>
            <h4>Total Users</h4>
            <p>{stats.users}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#ec4899' }}><Star size={28} /></div>
          <div className={styles.statInfo}>
            <h4>Children</h4>
            <p>{stats.children}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#10b981' }}><BookOpen size={28} /></div>
          <div className={styles.statInfo}>
            <h4>Total Entries</h4>
            <p>{stats.entries}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#f59e0b' }}><TrendingUp size={28} /></div>
          <div className={styles.statInfo}>
            <h4>Active Parents</h4>
            <p>{stats.parents}</p>
          </div>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <div className={styles.tableTitle}>
          <h3>Recent System Activity</h3>
        </div>
        <p style={{ color: '#64748b' }}>System is running smoothly. No issues reported.</p>
      </div>
    </div>
  );
}
