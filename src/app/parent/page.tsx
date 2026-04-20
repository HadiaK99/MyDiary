"use client";

import { useEffect, useState } from "react";
import { useAuth, User } from "@frontend/context/AuthContext";
import styles from "./parent.module.css";
import { Heart, Star, Sparkles, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ParentDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [child, setChild] = useState<User | null>(null);
  const [childStats, setChildStats] = useState({
    entries: 0,
    avgScore: 0,
    totalPoints: 0
  });

  useEffect(() => {
    if (user?.childId) {
      const fetchData = async () => {
        // Fetch child profile
        const userRes = await fetch("/api/admin/users");
        const userData = await userRes.json();
        const foundChild = userData.users?.find((u: User) => u.id === user.childId);
        if (foundChild) setChild(foundChild);

        // Fetch child diary entries for stats
        const diaryRes = await fetch(`/api/diary?userId=${user.childId}`);
        const diaryData = await diaryRes.json();
        if (diaryData.entries) {
          const totalPoints = diaryData.entries.reduce((acc: number, curr: any) => acc + curr.score, 0);
          setChildStats({
            entries: diaryData.entries.length,
            avgScore: diaryData.entries.length > 0 ? Math.round(totalPoints / diaryData.entries.length) : 0,
            totalPoints
          });
        }
      };
      fetchData();
    }
  }, [user]);

  if (!child) return (
    <div className={styles.welcomeCard}>
      <div className={styles.welcomeText}>
        <h1>Welcome, {user?.username}!</h1>
        <p>You haven't linked a child account yet. Please contact the administrator.</p>
      </div>
    </div>
  );

  return (
    <div>
      <section className={styles.welcomeCard}>
        <div className={styles.welcomeText}>
          <h1>Welcome, <span style={{ color: 'var(--primary)' }}>{user?.username}</span>!</h1>
          <p>Here's how {child.username} is doing today.</p>
        </div>
        <Heart size={80} fill="#fce7f3" color="#fce7f3" />
      </section>

      <div className={styles.childPreview}>
        <div className={styles.childHeader}>
          <div className={styles.childAvatar}>{child.username.charAt(0)}</div>
          <div className={styles.childInfo}>
            <h3>{child.username}</h3>
            <p><Sparkles size={16} inline /> Level 4 Moral Hero</p>
          </div>
          <button 
            type="button"
            onClick={() => router.push(`/parent/report/${child.id}`)} 
            className="pill-btn" 
            style={{ marginLeft: 'auto' }}
          >
            Full Report <ArrowRight size={18} />
          </button>
        </div>

        <div className={styles.progressGrid}>
          <div className={styles.progressStat}>
            <h5>Total Entries</h5>
            <p>{childStats.entries}</p>
          </div>
          <div className={styles.progressStat}>
            <h5>Avg. Score</h5>
            <p>{childStats.avgScore}%</p>
          </div>
          <div className={styles.progressStat}>
            <h5>Total Points</h5>
            <p>{childStats.totalPoints}</p>
          </div>
        </div>

        <div className={styles.reviewSection}>
          <h4 style={{ color: '#64748b', marginBottom: '15px' }}>Recent Review from You</h4>
          <div className={styles.reviewCard}>
            <h4>
              <span>Great job on Fajr!</span>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Yesterday</span>
            </h4>
            <p>"I'm so proud of how consistent you've been with your morning prayers this week. Keep it up, champ!"</p>
          </div>
          <button 
            type="button"
            onClick={() => router.push("/parent/reviews")} 
            style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            + Add New Review
          </button>
        </div>
      </div>
    </div>
  );
}
