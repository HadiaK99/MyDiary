"use client";

import styles from "./page.module.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@frontend/context/AuthContext";
import { calculateScore, getPerformanceRating } from "@shared/utils/scoring";
import Header from "@frontend/components/Navigation/Header";
import { 
  Sun, 
  Sparkles, 
  Leaf, 
  Smile, 
  BarChart3, 
  Trophy, 
  ArrowRight,
  Target
} from "lucide-react";

const DAYS = [
  { short: "Mon", date: 7 },
  { short: "Tue", date: 8 },
  { short: "Wed", date: 9 },
  { short: "Thu", date: 10, active: true },
  { short: "Fri", date: 11 },
  { short: "Sat", date: 12 },
  { short: "Sun", date: 13 },
];

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [todayScore, setTodayScore] = useState(0);
  const [todayRating, setTodayRating] = useState({ rating: "Poor", color: "#ccc" });
  const todayDate = new Date().toISOString().split('T')[0];

  const [reviews, setReviews] = useState<{id: string, text: string, date: string}[]>([]);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (user.role === "ADMIN") {
        router.push("/admin");
      } else if (user.role === "PARENT") {
        router.push("/parent");
      } else if (user.role === "CHILD") {
        const fetchData = async () => {
          // Fetch reviews
          const reviewRes = await fetch("/api/reviews");
          const reviewData = await reviewRes.json();
          if (reviewData.reviews) setReviews(reviewData.reviews);

          // Fetch today's entry
          const entryRes = await fetch(`/api/diary?date=${todayDate}`);
          const entryData = await entryRes.json();
          if (entryData.entry) {
            const entry = entryData.entry;
            setTodayScore(entry.score);
            setTodayRating(getPerformanceRating(entry.score));
          }
        };
        fetchData();
      }
    }
  }, [user, loading, router, todayDate]);

  if (loading || !user || user.role !== "CHILD") return null;

  return (
    <div className={styles.container}>
      <Header />

      <section className={styles.greetingHeader}>
        <h1>Hi, <span style={{ color: 'var(--primary)' }}>{user.username}</span> <Smile size={32} style={{ color: 'var(--primary)', verticalAlign: 'middle', display: 'inline' }} /></h1>
        
        {/* Day Selector */}
        <div className={styles.daySelector}>
          {DAYS.map(day => (
            <div key={day.short} className={`${styles.dayBtn} ${day.active ? styles.dayBtnActive : ''}`}>
              <span>{day.short}</span>
              <span>{day.date}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Hero / Featured Card */}
      <section className={`${styles.featuredCard} animate-fade-in`}>
        <h2>Let's start your day</h2>
        <p>Begin with a mindful morning reflection.</p>
        <div className={styles.sunIllustration}>
          <Sun size={80} strokeWidth={1.5} />
        </div>
        <Link href={`/diary/daily/${todayDate}`} className="pill-btn" style={{ marginTop: '20px' }}>
          Record My Day <ArrowRight size={18} />
        </Link>
      </section>

      {/* Parent Reviews Section */}
      {reviews.length > 0 && (
        <section className={`${styles.featuredCard} animate-fade-in`} style={{ background: '#fef2f2', border: '2px solid #fecaca', marginTop: '20px' }}>
          <h4 style={{ color: '#e11d48', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <Heart size={18} fill="#e11d48" /> Message from Parents
          </h4>
          <p style={{ fontStyle: 'italic', fontSize: '1.1rem', color: '#475569' }}>"{reviews[reviews.length - 1].text}"</p>
          <p style={{ textAlign: 'right', fontSize: '0.8rem', color: '#94a3b8', marginTop: '10px' }}>— {reviews[reviews.length - 1].date}</p>
        </section>
      )}

      {/* Quick Journal Sections */}
      <div className={styles.sectionHeader}>
        <h3>Quick Journal</h3>
        <Link href={`/diary/daily/${todayDate}`} className={styles.seeAll}>See all</Link>
      </div>

      <section className={styles.quickGrid}>
        <Link href="/diary/goals" className={`${styles.quickCard} ${styles.pinkCard}`} style={{ textDecoration: 'none' }}>
          <h4>My Goals <Target size={16} style={{ display: 'inline' }} /></h4>
          <p>Check your weekly targets.</p>
          <div className={styles.tagGroup}>
            <span className={styles.miniTag}>Active</span>
            <span className={`${styles.miniTag} ${styles.activeTag}`}>Track</span>
          </div>
        </Link>

        <div className={`${styles.quickCard} ${styles.blueCard}`}>
          <h4>Set Intentions <Sparkles size={16} style={{ display: 'inline' }} /></h4>
          <p>How do you want to feel?</p>
          <div className={styles.tagGroup}>
            <span className={styles.miniTag}>Today</span>
            <span className={styles.miniTag}>Family</span>
          </div>
        </div>

        <div className={`${styles.quickCard} ${styles.greenCard}`}>
          <h4>Emotions Tracker</h4>
          <p>Logged: Happy & Calm</p>
          <div className={styles.tagGroup}>
            <div className="score-badge bg-excellent" style={{ fontSize: '0.6rem' }}>EXCELLENT</div>
          </div>
        </div>
      </section>

      {/* Secondary Actions */}
      <section className={styles.sectionHeader} style={{ marginTop: '20px' }}>
        <h3>Milestones</h3>
      </section>
      
      <div className={styles.quickGrid} style={{ gridTemplateColumns: '1fr 1fr' }}>
        <Link href="/monthly/analysis/april" className="journal-card" style={{ padding: '20px', textAlign: 'center' }}>
          <BarChart3 size={32} style={{ margin: '0 auto', color: 'var(--primary)' }} />
          <p style={{ fontWeight: 700, marginTop: '10px' }}>Monthly Analysis</p>
        </Link>
        <Link href="/yearly/review" className="journal-card" style={{ padding: '20px', textAlign: 'center' }}>
          <Trophy size={32} style={{ margin: '0 auto', color: '#facc15' }} />
          <p style={{ fontWeight: 700, marginTop: '10px' }}>Yearly Review</p>
        </Link>
      </div>
    </div>
  );
}
